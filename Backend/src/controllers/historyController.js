
"use strict";

const History = require("../models/historyModel");

/* =========================================================
   SAVE CALCULATION HISTORY
========================================================= */

exports.saveHistory = async (req, res) => {
  try {

    const {
      calculatorType,
      calculatorName,
      category,
      inputs,
      result,
      summary
    } = req.body;

    const history = new History({
      userId: req.user ? req.user.id : null,
      calculatorType,
      calculatorName,
      category,
      inputs,
      result,
      summary
    });

    await history.save();

    res.status(201).json({
      success: true,
      data: history.toDisplay()
    });

  } catch (error) {

    console.error("Save history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save history"
    });

  }
};


/* =========================================================
   GET MY HISTORY
========================================================= */

exports.getMyHistory = async (req, res) => {

  try {

    const history = await History.findActive({
      userId: req.user.id
    })
      .limit(50);

    res.json(
      history.map(item => item.toDisplay())
    );

  } catch (error) {

    console.error("Fetch history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load history"
    });

  }

};


/* =========================================================
   DELETE SINGLE HISTORY ITEM (SOFT DELETE)
========================================================= */

exports.deleteHistory = async (req, res) => {

  try {

    const { id } = req.params;

    const history = await History.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!history) {
      return res.status(404).json({
        message: "History not found"
      });
    }

    history.deleted = true;

    await history.save();

    res.json({
      success: true,
      message: "History deleted"
    });

  } catch (error) {

    console.error("Delete history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete history"
    });

  }

};


/* =========================================================
   CLEAR ALL USER HISTORY
========================================================= */

exports.clearHistory = async (req, res) => {

  try {

    await History.updateMany(
      { userId: req.user.id },
      { deleted: true }
    );

    res.json({
      success: true,
      message: "All history cleared"
    });

  } catch (error) {

    console.error("Clear history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear history"
    });

  }

};

