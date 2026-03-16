/**
 * calculatorEngine.js
 * ───────────────────
 * Central engine for all calculators.
 *
 * Responsibilities
 *   1. Auto-load every calculator from ./calculators/
 *   2. Central unit conversion before run() is called
 *   3. Input validation (required fields, type coercion)
 *   4. Structured error responses — never throws to the caller
 *   5. Metadata API  (getAll, getOne, getCategories)
 *   6. Result envelope  { ok, data, error, meta }
 */

"use strict";

const fs   = require("fs");
const path = require("path");

/* ──────────────────────────────────────────────────────────────
   1. AUTO-LOAD all calculator modules from ./calculators/
────────────────────────────────────────────────────────────── */
const CALC_DIR   = path.join(__dirname, "calculators");
const calculators = {};           // { slug → module }
const slugByName  = {};           // { "Age Calculator" → "age" }

fs.readdirSync(CALC_DIR)
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
    try {
      const mod  = require(path.join(CALC_DIR, file));
      const slug = mod.slug || path.basename(file, ".js");

      if (!mod.run || typeof mod.run !== "function") {
        console.warn(`[Engine] Skipping ${file} — no run() function`);
        return;
      }

      calculators[slug] = mod;

      // also index by lower-cased name for loose look-ups
      if (mod.name) slugByName[mod.name.toLowerCase()] = slug;

    } catch (err) {
      console.error(`[Engine] Failed to load ${file}:`, err.message);
    }
  });

/* ──────────────────────────────────────────────────────────────
   2. CENTRAL UNIT-CONVERSION TABLE
      Key   = "slug.fieldName.fromUnit"
      Value = function(value) → converted value in the base unit
────────────────────────────────────────────────────────────── */
const UNIT_CONVERSIONS = {
  // ── BMI ──
  "bmi.weight.lb":  v => v * 0.453592,
  "bmi.weight.oz":  v => v * 0.0283495,
  "bmi.height.m":   v => v * 100,          // → cm
  "bmi.height.ft":  v => v * 30.48,        // → cm
  "bmi.height.in":  v => v * 2.54,         // → cm

  // ── Fuel Cost ──
  "fuelCost.distance.miles":    v => v * 1.60934,   // → km
  "fuelCost.mileage.L/100km":   v => 100 / v,       // → km/L
  "fuelCost.mileage.mpg":       v => v * 1.60934 / 3.785411, // → km/L
  "fuelCost.fuelPrice.$/gallon":v => v / 3.785411,  // → per litre

  // ── Simple Interest ──
  "simpleInterest.rate.% per month": v => v * 12,   // → % per year
  "simpleInterest.rate.% per day":   v => v * 365,  // → % per year
  "simpleInterest.time.months":      v => v / 12,   // → years
  "simpleInterest.time.days":        v => v / 365,  // → years

  // ── Compound Interest ──
  "compoundInterest.time.months":    v => v / 12,   // → years

  // ── EMI ──
  "emi.tenure.years":   v => v * 12,     // → months
};

/**
 * applyUnitConversions
 * Mutates a copy of rawInputs, converting any field whose
 * selected unit differs from the base unit.
 *
 * @param {string}  slug
 * @param {object}  rawInputs  — { fieldName: value, fieldName_unit: "kg", ... }
 * @returns {object} converted inputs (unit keys stripped)
 */
function applyUnitConversions(slug, rawInputs) {
  const converted = { ...rawInputs };

  Object.keys(rawInputs).forEach(key => {
    // unit keys are sent as  fieldName_unit  e.g. "weight_unit": "lb"
    if (!key.endsWith("_unit")) return;

    const fieldName = key.slice(0, -5);          // "weight_unit" → "weight"
    const unit      = rawInputs[key];
    const convKey   = `${slug}.${fieldName}.${unit}`;

    if (UNIT_CONVERSIONS[convKey]) {
      const raw = parseFloat(rawInputs[fieldName]);
      if (!isNaN(raw)) {
        converted[fieldName] = UNIT_CONVERSIONS[convKey](raw);
      }
    }

    // also pass the unit through as  fieldNameUnit  (camelCase) for
    // any calculator that does its own secondary conversion
    converted[`${fieldName}Unit`] = unit;

    // strip the _unit key so run() doesn't receive unexpected params
    delete converted[key];
  });

  return converted;
}

/* ──────────────────────────────────────────────────────────────
   3. INPUT VALIDATION
────────────────────────────────────────────────────────────── */
function validateInputs(mod, inputs) {
  const errors = [];

  (mod.fields || []).forEach(field => {
    const val = inputs[field.name];

    // skip optional fields — detected via label, hint, or name containing "optional"
    const haystack = [field.label, field.hint, field.name]
      .filter(Boolean).join(" ").toLowerCase();
    const isOptional = haystack.includes("optional") ||
      (field.hint && field.hint.toLowerCase().includes("leave blank"));

    if (isOptional && (val === undefined || val === null || val === "")) return;
    if (field.type === "select") return; // selects always have a default

    if (field.type === "number") {
      if (val === undefined || val === null || val === "") {
        errors.push(`${field.label} is required`);
      } else if (isNaN(parseFloat(val))) {
        errors.push(`${field.label} must be a number`);
      }
    }
  });

  return errors;
}

/* ──────────────────────────────────────────────────────────────
   4. RESULT ENVELOPE
────────────────────────────────────────────────────────────── */
function success(data, slug, durationMs) {
  return {
    ok:   true,
    data: { result: data },
    meta: {
      calculator: slug,
      timestamp:  new Date().toISOString(),
      durationMs,
    },
  };
}

function failure(message, code = "CALC_ERROR", slug = null) {
  return {
    ok:    false,
    error: { message, code },
    meta:  { calculator: slug, timestamp: new Date().toISOString() },
  };
}

/* ──────────────────────────────────────────────────────────────
   5. CORE  runCalculator(type, rawInputs)
────────────────────────────────────────────────────────────── */
/**
 * @param {string} type       — slug ("bmi") or display name ("BMI Calculator")
 * @param {object} rawInputs  — form field values, may include  *_unit  keys
 * @returns {{ ok, data|error, meta }}
 */
function runCalculator(type, rawInputs = {}) {
  const t0 = Date.now();

  // ── Resolve slug ──
  const slug = calculators[type]
    ? type
    : slugByName[String(type).toLowerCase()] || null;

  if (!slug || !calculators[slug]) {
    return failure(`Calculator "${type}" not found`, "NOT_FOUND", type);
  }

  const mod = calculators[slug];

  // ── Unit conversion ──
  let inputs;
  try {
    inputs = applyUnitConversions(slug, rawInputs);
  } catch (err) {
    return failure(`Unit conversion failed: ${err.message}`, "UNIT_ERROR", slug);
  }

  // ── Validation ──
  const validationErrors = validateInputs(mod, inputs);
  if (validationErrors.length > 0) {
    return failure(validationErrors.join("; "), "VALIDATION_ERROR", slug);
  }

  // ── Execute ──
  try {
    const result = mod.run(inputs);
    return success(result, slug, Date.now() - t0);
  } catch (err) {
    return failure(err.message || "Calculation failed", "RUN_ERROR", slug);
  }
}

/* ──────────────────────────────────────────────────────────────
   6. METADATA API
────────────────────────────────────────────────────────────── */

/** Returns full list of calculators (no run fn) */
function getAll() {
  return Object.values(calculators).map(mod => ({
    slug:        mod.slug,
    name:        mod.name,
    category:    mod.category,
    description: mod.description || "",
    fields:      mod.fields || [],
    formula:     mod.formula || null,
  }));
}

/** Returns one calculator by slug */
function getOne(slug) {
  const mod = calculators[slug];
  if (!mod) return null;
  return {
    slug:        mod.slug,
    name:        mod.name,
    category:    mod.category,
    description: mod.description || "",
    fields:      mod.fields || [],
    formula:     mod.formula || null,
  };
}

/** Returns unique categories with their calculators */
function getCategories() {
  const map = {};
  Object.values(calculators).forEach(mod => {
    const cat = mod.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push({ slug: mod.slug, name: mod.name, description: mod.description || "" });
  });
  return Object.entries(map).map(([category, items]) => ({ category, items }));
}

/** Check if a slug exists */
function exists(slug) {
  return Boolean(calculators[slug]);
}

/* ──────────────────────────────────────────────────────────────
   EXPORTS
────────────────────────────────────────────────────────────── */
module.exports = {
  // primary API
  runCalculator,          // runCalculator(slug, inputs) → envelope
  run: runCalculator,     // alias

  // metadata
  getAll,                 // → [{ slug, name, category, fields, ... }]
  getOne,                 // (slug) → { slug, name, ... } | null
  getCategories,          // → [{ category, items[] }]
  exists,                 // (slug) → boolean

  // internals (useful for testing)
  _calculators: calculators,
  _applyUnitConversions: applyUnitConversions,
};
