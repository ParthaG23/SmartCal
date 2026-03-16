"use strict";

require("dotenv").config();

const app              = require("./src/app");
const { connectDB }    = require("./src/config/db");

const PORT = process.env.PORT || 5000;
const ENV  = process.env.NODE_ENV || "development";

/* ============================================================
   UNHANDLED ERRORS
   Catch anything that escapes try/catch or promise chains.
   Log it, then exit — let the process manager (nodemon /
   PM2 / Docker) restart cleanly rather than running in a
   broken state.
============================================================ */
process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled Rejection:", reason);
  process.exit(1);
});

/* ============================================================
   STARTUP
============================================================ */
const start = async () => {
  // 1. Connect to MongoDB first — don't accept traffic until DB is ready
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(PORT, () => {
    console.log("");
    console.log("  ╔══════════════════════════════════════╗");
    console.log(`  ║   SmartCalc API                      ║`);
    console.log(`  ║   ENV  : ${ENV.padEnd(28)}║`);
    console.log(`  ║   PORT : ${String(PORT).padEnd(28)}║`);
    console.log(`  ║   Health: /api/health${" ".repeat(17)}║`);
    console.log("  ╚══════════════════════════════════════╝");
    console.log("");
  });

  // 3. Graceful HTTP shutdown on SIGTERM (Docker / Railway stop)
  //    DB shutdown is handled separately in db.js
  process.on("SIGTERM", () => {
    console.log("[Server] SIGTERM received — closing HTTP server");
    server.close(() => {
      console.log("[Server] HTTP server closed");
    });
  });
};

start();
