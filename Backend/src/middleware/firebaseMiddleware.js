"use strict";

const admin = require("../config/firebaseAdmin");

/* ================================================================
   FIREBASE TOKEN MIDDLEWARE
   Use this on routes where you want to accept Firebase tokens
   directly instead of your own JWT.
   (Optional — your current setup uses JWT after exchange,
    so authMiddleware.js is still the primary middleware)
================================================================ */
module.exports = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded; // { uid, email, name, picture, phone_number, ... }
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired Firebase token" });
  }

};
