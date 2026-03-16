const winston = require("winston");
const path = require("path");

/* Log format */
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] : ${stack || message}`;
  }
);

/* Logger instance */
const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    logFormat
  ),

  transports: [
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error"
    }),

    new winston.transports.File({
      filename: path.join("logs", "combined.log")
    })
  ]
});

/* Console logs for development */
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

module.exports = logger;