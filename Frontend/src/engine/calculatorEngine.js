/**
 * Frontend Calculator Engine
 * Replaces the entire backend calculator system.
 * All calculation logic now runs client-side.
 */

import bmi              from "./calculators/bmi.js";
import emi              from "./calculators/emi.js";
import age              from "./calculators/age.js";
import average          from "./calculators/average.js";
import compoundInterest from "./calculators/compoundInterest.js";
import discount         from "./calculators/discount.js";
import factorial        from "./calculators/factorial.js";
import fuelCost         from "./calculators/fuelCost.js";
import gst              from "./calculators/gst.js";
import percentage       from "./calculators/percentage.js";
import simpleInterest   from "./calculators/simpleInterest.js";
import temperature      from "./calculators/temperature.js";
import tip              from "./calculators/tip.js";

/* ── Calculator registry ─────────────────────────────────── */
const CALCULATORS = [
  bmi,
  emi,
  age,
  average,
  compoundInterest,
  discount,
  factorial,
  fuelCost,
  gst,
  percentage,
  simpleInterest,
  temperature,
  tip,
];

const SLUG_MAP = Object.fromEntries(CALCULATORS.map(c => [c.slug, c]));

/**
 * Get all calculators (metadata only — no `run` functions exposed).
 * Mirrors the old GET /api/calculators endpoint.
 */
export function getAllCalculators() {
  return CALCULATORS.map(({ run, ...meta }) => meta);
}

/**
 * Get a single calculator definition by its slug.
 * Mirrors the old GET /api/calculator/:type endpoint.
 */
export function getCalculatorBySlug(slug) {
  const calc = SLUG_MAP[slug];
  if (!calc) return null;
  const { run, ...meta } = calc;
  return meta;
}

/**
 * Run a calculation.
 * Mirrors the old POST /api/calculate/:type endpoint.
 *
 * @param {string} slug       Calculator type slug
 * @param {object} rawInputs  The values from the form (including _unit keys)
 * @returns {{ result: object }}
 */
export function runCalculation(slug, rawInputs) {
  const calc = SLUG_MAP[slug];
  if (!calc) throw new Error(`Calculator "${slug}" not found`);

  /* ── Normalise unit keys ─────────────────────────────── */
  const inputs = {};
  for (const [key, value] of Object.entries(rawInputs)) {
    if (key.endsWith("_unit")) {
      // e.g. "weight_unit" → "weightUnit"
      const fieldName = key.replace(/_unit$/, "");
      inputs[`${fieldName}Unit`] = value;
    } else {
      inputs[key] = value;
    }
  }

  /* ── Execute ────────────────────────────────────────── */
  const result = calc.run(inputs);
  return { result };
}
