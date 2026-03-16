"use strict";

const express = require("express");
const router  = express.Router();

const {
  getCalculators,
  getCategories,
  getCalculator,
  calculate,
  getHistory,
  getHistoryById,
  deleteHistory,
  clearHistory,
} = require("../controllers/calculatorController");

/* ── Metadata ──────────────────────────────────────────────────
   ORDER MATTERS — specific routes must come before /:type
   so Express never swallows "categories" or "history" as a type param.
────────────────────────────────────────────────────────────── */
router.get("/",           getCalculators);   // GET  /api/calculators
router.get("/categories", getCategories);    // GET  /api/calculators/categories

/* ── History ── must be before /:type ─────────────────────── */
router.get("/history",         getHistory);      // GET    /api/calculators/history
router.get("/history/:id",     getHistoryById);  // GET    /api/calculators/history/:id
router.delete("/history",      clearHistory);    // DELETE /api/calculators/history
router.delete("/history/:id",  deleteHistory);   // DELETE /api/calculators/history/:id

/* ── Single calculator metadata + run ────────────────────── */
router.get("/:type",   getCalculator);   // GET  /api/calculators/:type
router.post("/:type",  calculate);       // POST /api/calculators/:type

module.exports = router;
