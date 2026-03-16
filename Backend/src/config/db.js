"use strict";

const mongoose = require("mongoose");

/* ============================================================
   CONNECTION OPTIONS
   Mongoose 7+ handles poolSize via maxPoolSize.
   These are safe defaults for a MERN app on any host.
============================================================ */
const MONGO_OPTIONS = {
  maxPoolSize:        10,   // max simultaneous connections in pool
  serverSelectionTimeoutMS: 5000,   // fail fast if no server found
  socketTimeoutMS:   45000,  // close idle sockets after 45s
  family:            4,      // force IPv4 (avoids some DNS issues)
};

/* ============================================================
   STATE
============================================================ */
let isConnected = false;

/* ============================================================
   EVENT LISTENERS
   Attach once so they are not duplicated on hot-reload.
============================================================ */
function attachEvents() {
  const db = mongoose.connection;

  db.on("connected", () => {
    isConnected = true;
    console.log(`[DB] Connected   : ${db.host}:${db.port}/${db.name}`);
  });

  db.on("disconnected", () => {
    isConnected = false;
    console.warn("[DB] Disconnected — Mongoose will auto-reconnect");
  });

  db.on("reconnected", () => {
    isConnected = true;
    console.log("[DB] Reconnected");
  });

  db.on("error", (err) => {
    isConnected = false;
    console.error("[DB] Error:", err.message);
  });
}

/* ============================================================
   GRACEFUL SHUTDOWN
   Called on SIGINT / SIGTERM so connections close cleanly
   instead of being killed mid-query.
============================================================ */
async function gracefulShutdown(signal) {
  console.log(`\n[DB] ${signal} received — closing connection`);
  try {
    await mongoose.connection.close();
    console.log("[DB] Connection closed — process exiting");
  } catch (err) {
    console.error("[DB] Error during shutdown:", err.message);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT",  () => gracefulShutdown("SIGINT"));   // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));  // Docker / cloud stop

/* ============================================================
   connectDB
   Call once on server startup.
   Safe to call multiple times — skips if already connected.
============================================================ */
const connectDB = async () => {
  // Prevent duplicate connections on nodemon hot-reload
  if (isConnected) {
    console.log("[DB] Already connected — reusing existing connection");
    return;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("[DB] MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  attachEvents();

  try {
    await mongoose.connect(uri, MONGO_OPTIONS);
    // "connected" event above fires here — isConnected set to true
  } catch (err) {
    console.error("[DB] Initial connection failed:", err.message);
    process.exit(1);
  }
};

/* ============================================================
   getStatus
   Returns a lightweight health object.
   Used by GET /api/health in your app.js.
============================================================ */
const getStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const db = mongoose.connection;

  return {
    status:   states[db.readyState] ?? "unknown",
    host:     db.host     ?? null,
    port:     db.port     ?? null,
    database: db.name     ?? null,
    poolSize: MONGO_OPTIONS.maxPoolSize,
  };
};

module.exports = { connectDB, getStatus };
