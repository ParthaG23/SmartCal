"use strict";

const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const compression = require("compression");
const morgan      = require("morgan");

const calculatorRoutes = require("./routes/calculatorRoutes");
const authRoutes       = require("./routes/authRoutes");
const errorHandler     = require("./middleware/errorMiddleware");
const requestLogger    = require("./middleware/requestLogger");
const { getStatus }    = require("./config/db");

const app    = express();
const isProd = process.env.NODE_ENV === "production";
const isDev  = !isProd;

/* ============================================================
   SECURITY — Helmet
============================================================ */
app.use(
  helmet({
    contentSecurityPolicy:    false,
    crossOriginEmbedderPolicy: false,
  })
);

/* ============================================================
   CORS — must be before routes
============================================================ */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

const corsOptions = {
  origin: isDev
    ? "*"
    : (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      },
  methods:             ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders:      ["Content-Type", "Authorization"],  // ✅ Authorization allowed
  exposedHeaders:      ["X-Request-Id"],
  credentials:         true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/* ============================================================
   BODY PARSING — must be before routes
============================================================ */
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

/* ============================================================
   COMPRESSION + LOGGING
============================================================ */
app.use(compression());
app.use(morgan(isDev ? "dev" : "combined"));
app.use(requestLogger);

/* ============================================================
   RATE LIMITING
============================================================ */
let apiLimiter, calcLimiter;
try {
  const rateLimit = require("express-rate-limit");

  apiLimiter = rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             200,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: "Too many requests — please slow down" },
  });

  calcLimiter = rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             60,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: "Calculation limit reached — try again later" },
  });
} catch {
  console.warn("[App] express-rate-limit not found — rate limiting disabled");
  apiLimiter  = (req, res, next) => next();
  calcLimiter = (req, res, next) => next();
}

app.use("/api", apiLimiter);
app.use("/api/calculators/:type", calcLimiter);

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/api/health", (req, res) => {
  const db         = getStatus();
  const httpStatus = db.status === "connected" ? 200 : 503;

  return res.status(httpStatus).json({
    success:   db.status === "connected",
    server:    "online",
    database:  db,
    uptime:    `${Math.floor(process.uptime())}s`,
    env:       process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
});

/* ============================================================
   ROUTES — after all middleware        ✅
============================================================ */
app.use("/api/auth",        authRoutes);        // ✅ mounted once
app.use("/api/calculators", calculatorRoutes);  // ✅ mounted once

/* ============================================================
   404
============================================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* ============================================================
   GLOBAL ERROR HANDLER — must be last
============================================================ */
app.use(errorHandler);

module.exports = app;