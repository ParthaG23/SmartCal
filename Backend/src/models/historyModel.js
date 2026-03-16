"use strict";

const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    /* ── User who ran the calculation ───────────────────── */
    userId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:   "User",
      index: true,
      default: null,   // null = anonymous (guest calculation)
    },

    /* ── Calculator identity ─────────────────────────────── */
    calculatorType: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,
    },

    calculatorName: {
      type:    String,
      trim:    true,
      default: "",
    },

    category: {
      type:    String,
      trim:    true,
      default: "",
    },

    /* ── Raw inputs ──────────────────────────────────────── */
    inputs: {
      type:     mongoose.Schema.Types.Mixed,
      required: true,
    },

    /* ── Result ──────────────────────────────────────────── */
    result: {
      type:     mongoose.Schema.Types.Mixed,
      required: true,
    },

    /* ── Display summary ─────────────────────────────────── */
    summary: {
      type:    String,
      default: "",
    },

    /* ── Soft-delete ─────────────────────────────────────── */
    deleted: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ── Compound indexes ────────────────────────────────────── */
historySchema.index({ userId: 1, createdAt: -1 });           // my recent history
historySchema.index({ userId: 1, calculatorType: 1, createdAt: -1 }); // my recent BMI

/* ── Instance helper ─────────────────────────────────────── */
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

/* ── Static helper ───────────────────────────────────────── */
historySchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, deleted: false }).sort({ createdAt: -1 });
};

module.exports = mongoose.model("History", historySchema);