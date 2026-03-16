"use strict";

const History = require("../models/historyModel");
const engine  = require("../services/calculatorEngine");

/* ── Summary helper ──────────────────────────────────────── */
function buildSummary(result) {
  if (result === null || result === undefined) return "";
  if (typeof result !== "object") return String(result);
  if (Array.isArray(result)) {
    const first = result[0];
    if (first && typeof first === "object") return String(first.value ?? "");
    return String(first ?? "");
  }
  const firstVal = Object.values(result)[0];
  if (firstVal !== null && typeof firstVal === "object") {
    const flat = Object.values(result).find(v => typeof v !== "object");
    return flat !== undefined ? String(flat) : "";
  }
  return String(firstVal ?? "");
}

/* ============================================================
   GET /api/calculators
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
============================================================ */
exports.calculate = async (req, res, next) => {
  try {
    const { type }  = req.params;
    const rawInputs = req.body ?? {};

    if (!engine.exists(type)) {
      return res.status(404).json({
        success: false,
        message: `Calculator "${type}" not found`,
      });
    }

    const envelope = engine.runCalculator(type, rawInputs);

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

    // ✅ save history with userId from JWT (null if guest)
    let historyId = null;
    try {
      const calcMeta = engine.getOne(type) ?? {};
      const record   = await History.create({
        userId:         req.user?.id ?? null,   // ✅ per-user
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
   ✅ only returns current user's history
============================================================ */
exports.getHistory = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 20, 200);
    const page   = Math.max(parseInt(req.query.page)  || 1,  1);
    const skip   = (page - 1) * limit;

    // ✅ scope to logged-in user
    const filter = {
      deleted: false,
      userId:  req.user.id,
    };

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
   ✅ only returns record if it belongs to current user
============================================================ */
exports.getHistoryById = async (req, res, next) => {
  try {
    const record = await History.findOne({
      _id:     req.params.id,
      userId:  req.user.id,     // ✅ ownership check
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
   ✅ only deletes if record belongs to current user
============================================================ */
exports.deleteHistory = async (req, res, next) => {
  try {
    const record = await History.findOneAndUpdate(
      {
        _id:     req.params.id,
        userId:  req.user.id,   // ✅ ownership check
        deleted: false,
      },
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
   ✅ only clears current user's history
============================================================ */
exports.clearHistory = async (req, res, next) => {
  try {
    const { modifiedCount } = await History.updateMany(
      {
        userId:  req.user.id,   // ✅ scoped to user
        deleted: false,
      },
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