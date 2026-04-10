/**
 * API Service — Fully client-side (no backend required)
 *
 * All calculator logic runs locally via the engine.
 */

import { getAllCalculators, runCalculation } from "../engine/calculatorEngine";

/* ------------------------------------------------ */
/* calculators                                      */
/* ------------------------------------------------ */

export const getCalculators = () =>
  Promise.resolve({ data: { data: getAllCalculators() } });

export const calculate = async (type, data) => {
  try {
    const { result } = await runCalculation(type, data);
    return { data: { result } };
  } catch (err) {
    throw {
      response: { data: { message: err.message } },
    };
  }
};
