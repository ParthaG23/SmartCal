"use strict";

const History = require("../models/historyModel");
const engine  = require("../services/calculatorEngine");

/* ============================================================
   HELPER: extract a one-line summary from any result shape
   Used as the display value in the History list.
============================================================ */
function buildSummary(result) {
  if (result === null || result === undefined) return "";

  // plain scalar
  if (typeof result !== "object") return String(result);

  // array of { label, value } or plain values
  if (Array.isArray(result)) {
    const first = result[0];
    if (first && typeof first === "object") return String(first.value ?? "");
    return String(first ?? "");
  }

  // object: return the first value
  const firstVal = Object.values(result)[0];

  // skip nested objects/arrays (e.g. yearly_breakdown) as the summary
  if (firstVal !== null && typeof firstVal === "object") {
    const flat = Object.values(result).find(v => typeof v !== "object");
    return flat !== undefined ? String(flat) : "";
  }

  return String(firstVal ?? "");
}


/* ============================================================
   GET /api/calculators
   Returns all calculator metadata (name, slug, category, fields[])
   driven entirely by the engine -- no hardcoded maps needed.
============================================================ */
exports.getCalculators = (req, res) => {
  try {
    const calculators = engine.getAll();
    return res.status(200).json({
      success: true,
      count:   calculators.length,
      data:    calculators,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load calculators",
      error:   err.message,
    });
  }
};


/* ============================================================
   GET /api/calculators/categories
   Returns calculators grouped by category.
============================================================ */
exports.getCategories = (req, res) => {
  try {
    const categories = engine.getCategories();
    return res.status(200).json({
      success: true,
      count:   categories.length,
      data:    categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load categories",
      error:   err.message,
    });
  }
};


/* ============================================================
   GET /api/calculators/:type
   Returns metadata for a single calculator (fields, description).
   Used by the frontend to render dynamic forms.
============================================================ */
exports.getCalculator = (req, res) => {
  const { type } = req.params;
  const calculator = engine.getOne(type);

  if (!calculator) {
    return res.status(404).json({
      success: false,
      message: `Calculator "${type}" not found`,
    });
  }

  return res.status(200).json({
    success: true,
    data:    calculator,
  });
};


/* ============================================================
   POST /api/calculators/:type
   Runs a calculation, saves to history, returns result.

   Request body (JSON):
     Field values defined in the calculator fields[].
     Unit selections use the convention:  fieldName_unit
     Example: { weight: 154, weight_unit: "lb", height: 175 }
     The engine converts units before calling run().
============================================================ */
exports.calculate = async (req, res, next) => {
  try {
    const { type }  = req.params;
    const rawInputs = req.body ?? {};

    // 1. Check calculator exists before doing anything
    if (!engine.exists(type)) {
      return res.status(404).json({
        success: false,
        message: `Calculator "${type}" not found`,
      });
    }

    // 2. Run via engine (unit conversion + validation inside)
    const envelope = engine.runCalculator(type, rawInputs);

    // 3. Handle engine-level errors
    if (!envelope.ok) {
      const statusCode =
        envelope.error.code === "NOT_FOUND"        ? 404 :
        envelope.error.code === "VALIDATION_ERROR" ? 422 : 400;

      return res.status(statusCode).json({
        success: false,
        message: envelope.error.message,
        code:    envelope.error.code,
      });
    }

    const result = envelope.data.result;

    // 4. Persist to history
    // History failure must NEVER break the calculation response
    let historyId = null;
    try {
      const calcMeta = engine.getOne(type) ?? {};
      const record   = await History.create({
        calculatorType: type,
        calculatorName: calcMeta.name     ?? type,
        category:       calcMeta.category ?? "",
        inputs:         rawInputs,
        result,
        summary:        buildSummary(result),
      });
      historyId = record._id;
    } catch (histErr) {
      console.error("[Controller] History save failed:", histErr.message);
    }

    // 5. Success response
    return res.status(200).json({
      success:    true,
      calculator: type,
      result,
      meta: {
        ...envelope.meta,
        historyId,
      },
    });

  } catch (err) {
    next(err);
  }
};


/* ============================================================
   GET /api/calculators/history
   Returns all history records, newest first.
   Query params: ?page=1&limit=20&type=bmi
============================================================ */
exports.getHistory = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 20,  200);
    const page   = Math.max(parseInt(req.query.page)  || 1,   1);
    const skip   = (page - 1) * limit;
    const filter = { deleted: false };

    // optional filter by calculator type
    if (req.query.type) filter.calculatorType = req.query.type;

    const [records, total] = await Promise.all([
      History.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      History.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages:  Math.ceil(total / limit),
      count:  records.length,
      data:   records,
    });

  } catch (err) {
    next(err);
  }
};


/* ============================================================
   GET /api/calculators/history/:id
   Returns a single history record by ID.
============================================================ */
exports.getHistoryById = async (req, res, next) => {
  try {
    const record = await History.findOne({
      _id:     req.params.id,
      deleted: false,
    }).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data:    record,
    });

  } catch (err) {
    next(err);
  }
};


/* ============================================================
   DELETE /api/calculators/history/:id
   Soft-deletes a single history record.
============================================================ */
exports.deleteHistory = async (req, res, next) => {
  try {
    const record = await History.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History record deleted",
    });

  } catch (err) {
    next(err);
  }
};


/* ============================================================
   DELETE /api/calculators/history
   Soft-deletes ALL history records.
============================================================ */
exports.clearHistory = async (req, res, next) => {
  try {
    const { modifiedCount } = await History.updateMany(
      { deleted: false },
      { deleted: true }
    );

    return res.status(200).json({
      success:      true,
      message:      "History cleared",
      deletedCount: modifiedCount,
    });

  } catch (err) {
    next(err);
  }
};
