"use strict";

/* ============================================================
   GLOBAL ERROR HANDLER
   Must be registered LAST in app.js (4-argument middleware).
   Handles both operational errors (known) and programmer
   errors (unknown bugs) with clean JSON responses.
============================================================ */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  /* ── Log the full error server-side ── */
  const isDev = process.env.NODE_ENV !== "production";
  console.error(`[Error] ${req.method} ${req.originalUrl} —`, err.message);
  if (isDev) console.error(err.stack);

  /* ── Mongoose: cast error (bad ObjectId) ── */
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: "${err.value}"`,
      code:    "INVALID_ID",
    });
  }

  /* ── Mongoose: duplicate key ── */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `Duplicate value for "${field}"`,
      code:    "DUPLICATE_KEY",
    });
  }

  /* ── Mongoose: validation error ── */
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(422).json({
      success: false,
      message: messages.join("; "),
      code:    "VALIDATION_ERROR",
    });
  }

  /* ── CORS error ── */
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({
      success: false,
      message: err.message,
      code:    "CORS_ERROR",
    });
  }

  /* ── JWT errors (if you add auth later) ── */
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      code:    "INVALID_TOKEN",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      code:    "TOKEN_EXPIRED",
    });
  }

  /* ── Payload too large ── */
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload too large (max 50kb)",
      code:    "PAYLOAD_TOO_LARGE",
    });
  }

  /* ── Default: 500 Internal Server Error ── */
  const status  = err.statusCode ?? err.status ?? 500;
  const message = status < 500
    ? err.message
    : isDev
      ? err.message
      : "Something went wrong — please try again";

  return res.status(status).json({
    success: false,
    message,
    code:    err.code ?? "SERVER_ERROR",
    ...(isDev && { stack: err.stack }),   // stack trace in dev only
  });
};

module.exports = errorHandler;
