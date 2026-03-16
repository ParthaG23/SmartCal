"use strict";

const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  signup,
  login,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require("../controllers/authController");

/* Public */
router.post("/signup", signup);
router.post("/login",  login);

/* Protected */
router.put   ("/profile",  authMiddleware, updateProfile);
router.put   ("/password", authMiddleware, updatePassword);
router.delete("/account",  authMiddleware, deleteAccount);

module.exports = router;