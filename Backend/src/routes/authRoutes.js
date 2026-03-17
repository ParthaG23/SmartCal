"use strict";

const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  signup,
  login,
  firebaseAuth,     // ✅ handles Google + GitHub + Facebook + Phone
  updateProfile,
  updatePassword,
  deleteAccount,
} = require("../controllers/authController");

/* ── Public ── */
router.post("/signup",   signup);
router.post("/login",    login);
router.post("/firebase", firebaseAuth);   // ✅ single endpoint for ALL Firebase providers

/* ── Protected ── */
router.put   ("/profile",  authMiddleware, updateProfile);
router.put   ("/password", authMiddleware, updatePassword);
router.delete("/account",  authMiddleware, deleteAccount);

module.exports = router;