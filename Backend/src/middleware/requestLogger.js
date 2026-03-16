"use strict";

const { randomUUID } = require("crypto");

/* ============================================================
   REQUEST LOGGER MIDDLEWARE
   - Stamps every request with a unique X-Request-Id header
   - Logs method, path, status, duration on response finish
   - Skips /api/health to avoid log noise
============================================================ */
const requestLogger = (req, res, next) => {

  // Skip health-check polling from cluttering logs
  if (req.originalUrl === "/api/health") return next();

  // Attach a unique ID to every request — visible in response header
  const requestId  = randomUUID();
  req.requestId    = requestId;
  res.setHeader("X-Request-Id", requestId);

  const startTime  = Date.now();
  const { method, originalUrl } = req;

  // Log when the response is fully sent
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const status   = res.statusCode;

    const color =
      status >= 500 ? "\x1b[31m" :   // red
      status >= 400 ? "\x1b[33m" :   // yellow
      status >= 300 ? "\x1b[36m" :   // cyan
                      "\x1b[32m";    // green
    const reset = "\x1b[0m";

    const isDev = process.env.NODE_ENV !== "production";

    if (isDev) {
      console.log(
        `${color}[${method}]${reset} ${originalUrl} ` +
        `${color}${status}${reset} — ${duration}ms  id:${requestId.slice(0, 8)}`
      );
    } else {
      // production: structured JSON line (easy to parse in log aggregators)
      console.log(
        JSON.stringify({
          type:      "request",
          method,
          url:       originalUrl,
          status,
          duration:  `${duration}ms`,
          requestId,
          timestamp: new Date().toISOString(),
        })
      );
    }
  });

  next();
};

module.exports = requestLogger;
