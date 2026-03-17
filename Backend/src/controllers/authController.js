"use strict";

const User    = require("../models/User");
const History = require("../models/historyModel");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const admin   = require("../config/firebaseAdmin"); // ✅ clean import

/* ── helper ── */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ============================================================
   POST /api/auth/signup
============================================================ */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });
    const token  = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   POST /api/auth/login
============================================================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   POST /api/auth/firebase        🌐 public
   Single endpoint for ALL Firebase providers:
   Google, GitHub, Facebook, Phone OTP
============================================================ */
exports.firebaseAuth = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken)
      return res.status(400).json({ success: false, message: "No Firebase token provided" });

    /* ── Verify with Firebase Admin ── */
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const {
      uid,
      email,
      name,
      picture,
      phone_number: phone,
      firebase: { sign_in_provider: provider },
    } = decoded;

    const displayName = name ?? email?.split("@")[0] ?? phone ?? "SmartCal User";

    /* ── Find or create user ── */
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        ...(email ? [{ email }] : []),
      ]
    });

    if (!user) {
      user = await User.create({
        name:        displayName,
        email:       email ?? `${uid}@firebase.local`,
        picture:     picture ?? null,
        phone:       phone   ?? null,
        firebaseUid: uid,
        provider,
        password:    await bcrypt.hash(uid + process.env.JWT_SECRET, 10),
      });
    } else {
      let changed = false;
      if (!user.firebaseUid)          { user.firebaseUid = uid;     changed = true; }
      if (picture && !user.picture)   { user.picture     = picture; changed = true; }
      if (phone   && !user.phone)     { user.phone       = phone;   changed = true; }
      if (changed) await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        picture: user.picture,
        phone:   user.phone,
      }
    });
  } catch (err) {
    console.error("Firebase auth error:", err.message);
    res.status(401).json({ success: false, message: "Firebase authentication failed" });
  }
};

/* ============================================================
   PUT /api/auth/profile          🔒 protected
============================================================ */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim())
      return res.status(400).json({ success: false, message: "Name is required" });

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing)
        return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim(), ...(email && { email: email.trim() }) },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   PUT /api/auth/password         🔒 protected
============================================================ */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "All fields are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const user  = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match)
      return res.status(400).json({ success: false, message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   DELETE /api/auth/account       🔒 protected
============================================================ */
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    await History.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};