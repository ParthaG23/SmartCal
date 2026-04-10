/**
 * Frontend Calculator Engine
 * Replaces the entire backend calculator system.
 * All calculation logic now runs client-side.
 */

/* Automatically import all calculators from category subfolders */
const calcModules = import.meta.glob("./calculators/**/*.js", { eager: true });

/* ── Calculator registry ─────────────────────────────────── */
const CALCULATORS = Object.values(calcModules).map(mod => mod.default).filter(Boolean);

const SLUG_MAP = Object.fromEntries(CALCULATORS.map(c => [c.slug, c]));

/**
 * Get all calculators (metadata only — no `run` functions exposed).
 * Mirrors the old GET /api/calculators endpoint.
 */
export function getAllCalculators() {
  return CALCULATORS.map(({ run, ...meta }) => meta).sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
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
export async function runCalculation(slug, rawInputs = {}) {
  const calc = SLUG_MAP[slug];
  if (!calc) throw new Error(`Calculator "${slug}" not found`);

  /* ── Normalise unit keys ─────────────────────────────── */
  const inputs = {};
  for (const [key, value] of Object.entries(rawInputs)) {
    if (key.endsWith("_unit")) {
      const fieldName = key.replace(/_unit$/, "");
      inputs[`${fieldName}Unit`] = value;
    } else {
      inputs[key] = value;
    }
  }

  /* ── Execute (now supporting async) ──────────────────── */
  const result = await calc.run(inputs);
  return { result };
}
