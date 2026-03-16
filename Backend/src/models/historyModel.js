"use strict";

const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    /* ── Calculator identity ─────────────────────────────── */
    calculatorType: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,          // fast filter by type on History page
    },

    calculatorName: {
      type:    String,         // e.g. "BMI Calculator"  (stored for display)
      trim:    true,
      default: "",
    },

    category: {
      type:    String,         // e.g. "Health", "Finance"
      trim:    true,
      default: "",
    },

    /* ── Raw inputs the user submitted ──────────────────── */
    inputs: {
      type:     mongoose.Schema.Types.Mixed,   // any key/value shape
      required: true,
    },

    /* ── Result from calculator run() ───────────────────── */
    result: {
      type:     mongoose.Schema.Types.Mixed,   // scalar | object | array
      required: true,
    },

    /* ── Optional: primary display value for history list ─
       e.g. "22.86" for BMI, "₹16,453.09" for CI
       Filled by the controller so the History page
       doesn't have to parse the full result object.      */
    summary: {
      type:    String,
      default: "",
    },

    /* ── Soft-delete flag ───────────────────────────────── */
    deleted: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    timestamps: true,          // createdAt + updatedAt auto-managed
    versionKey: false,         // remove __v field
  }
);

/* ── Compound index: fast "my recent BMI calculations" ── */
historySchema.index({ calculatorType: 1, createdAt: -1 });

/* ── Instance helper: human-readable label ───────────── */
historySchema.methods.toDisplay = function () {
  return {
    id:             this._id,
    calculatorType: this.calculatorType,
    calculatorName: this.calculatorName,
    category:       this.category,
    summary:        this.summary,
    inputs:         this.inputs,
    result:         this.result,
    createdAt:      this.createdAt,
  };
};

/* ── Static: non-deleted records only ───────────────── */
historySchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, deleted: false }).sort({ createdAt: -1 });
};

module.exports = mongoose.model("History", historySchema);
