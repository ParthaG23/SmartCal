
"use strict";

const express = require("express");
const router = express.Router();

const historyController = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================================================
   SAVE CALCULATION HISTORY
   POST /api/history
========================================================= */
router.post(
  "/",
  authMiddleware,
  historyController.saveHistory
);


/* =========================================================
   GET LOGGED-IN USER HISTORY
   GET /api/history/my-history
========================================================= */
router.get(
  "/my-history",
  authMiddleware,
  historyController.getMyHistory
);


/* =========================================================
   DELETE SINGLE HISTORY ITEM
   DELETE /api/history/:id
========================================================= */
router.delete(
  "/:id",
  authMiddleware,
  historyController.deleteHistory
);


/* =========================================================
   CLEAR ALL USER HISTORY
   DELETE /api/history/clear/all
========================================================= */
router.delete(
  "/clear/all",
  authMiddleware,
  historyController.clearHistory
);

module.exports = router;

