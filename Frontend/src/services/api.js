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

export const calculate = (type, data) => {
  try {
    const { result } = runCalculation(type, data);
    return Promise.resolve({ data: { result } });
  } catch (err) {
    return Promise.reject({
      response: { data: { message: err.message } },
    });
  }
};
