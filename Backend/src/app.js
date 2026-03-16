"use strict";

const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const compression = require("compression");
const morgan      = require("morgan");

const calculatorRoutes = require("./routes/calculatorRoutes");
const errorHandler     = require("./middleware/errorMiddleware");
const requestLogger    = require("./middleware/requestLogger");
const { getStatus }    = require("./config/db");

const app  = express();
const isProd = process.env.NODE_ENV === "production";
const isDev  = !isProd;

/* ============================================================
   SECURITY — Helmet
   Sets safe HTTP headers. Content-Security-Policy is relaxed
   here because this is a pure JSON API (no HTML served).
============================================================ */
app.use(
  helmet({
    contentSecurityPolicy: false,   // not serving HTML
    crossOriginEmbedderPolicy: false,
  })
);

/* ============================================================
   CORS
   Dev  : allow all origins
   Prod : only allow origins listed in ALLOWED_ORIGINS env var
============================================================ */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

const corsOptions = {
  origin: isDev
    ? "*"
    : (origin, callback) => {
        // allow requests with no origin (e.g. mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      },
  methods:          ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders:   ["Content-Type", "Authorization"],
  exposedHeaders:   ["X-Request-Id"],
  credentials:      true,
  optionsSuccessStatus: 200,   // some legacy browsers choke on 204
};

app.use(cors(corsOptions));

/* ============================================================
   RATE LIMITING
   Requires: npm install express-rate-limit
   Soft-limits per IP to prevent abuse.
   Separate limits for general API vs heavy calculation routes.
============================================================ */
let apiLimiter, calcLimiter;
try {
  const rateLimit = require("express-rate-limit");

  // 200 requests per 15 min per IP (all routes)
  apiLimiter = rateLimit({
    windowMs:         15 * 60 * 1000,
    max:              200,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { success: false, message: "Too many requests — please slow down" },
  });

  // 60 calculations per 15 min per IP
  calcLimiter = rateLimit({
    windowMs:         15 * 60 * 1000,
    max:              60,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { success: false, message: "Calculation limit reached — try again later" },
  });
} catch {
  // express-rate-limit not installed — skip silently in dev
  console.warn("[App] express-rate-limit not found — rate limiting disabled");
  apiLimiter  = (req, res, next) => next();
  calcLimiter = (req, res, next) => next();
}

app.use("/api", apiLimiter);
app.use("/api/calculators/:type", calcLimiter);  // tighter limit on POST :type

/* ============================================================
   BODY PARSING
   Limit payload size to prevent memory-exhaustion attacks.
============================================================ */
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

/* ============================================================
   COMPRESSION
   Skips compression for small responses (< 1 KB) automatically.
============================================================ */
app.use(compression());

/* ============================================================
   LOGGING
   Dev : colorized dev output
   Prod: combined format (Apache-style, good for log aggregators)
============================================================ */
app.use(morgan(isDev ? "dev" : "combined"));
app.use(requestLogger);

/* ============================================================
   HEALTH CHECK
   GET /api/health  —  no auth, no rate limit
   Returns DB status + uptime. Useful for Docker / Railway.
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
   ROUTES
============================================================ */
app.use("/api/calculators", calculatorRoutes);

/* ============================================================
   404 — catch any unmatched route before the error handler
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
