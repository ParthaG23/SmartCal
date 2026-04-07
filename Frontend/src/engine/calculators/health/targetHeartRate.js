export default {
  name: "Target Heart Rate", slug: "target-heart-rate", category: "Health",
  description: "Calculates optimal heart rate training zones using the Karvonen method",
  fields: [
    { name: "age", label: "Age (years)", type: "number", placeholder: "25" },
    { name: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "70" }
  ],
  run: ({ age, restingHR }) => {
    const a = parseFloat(age), rhr = parseFloat(restingHR) || 72;
    if (!a) throw new Error("Age is required");
    const mhr = 220 - a, hrr = mhr - rhr;
    const zone = (lo, hi) => Math.round(hrr * lo + rhr) + "–" + Math.round(hrr * hi + rhr) + " bpm";
    return {
      max_heart_rate: mhr + " bpm",
      heart_rate_reserve: hrr + " bpm",
      warm_up_zone: zone(0.5, 0.6),
      fat_burn_zone: zone(0.6, 0.7),
      cardio_zone: zone(0.7, 0.8),
      peak_zone: zone(0.8, 0.9),
      max_effort: zone(0.9, 1.0),
      vo2max_estimate: (15.3 * (mhr / rhr)).toFixed(1) + " ml/kg/min"
    };
  }
};