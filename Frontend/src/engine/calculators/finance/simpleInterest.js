export default {
  name: "Simple Interest",
  slug: "simpleInterest",
  category: "Finance",
  description: "Simple interest with maturity value, daily interest and comparison to compound growth",

  fields: [
    { name: "principal", label: "Principal Amount", type: "number", placeholder: "10000", units: ["₹","$","€","£"], defaultUnit: "₹" },
    { name: "rate",      label: "Annual Interest Rate (%)", type: "number", placeholder: "8" },
    { name: "time",      label: "Time Period", type: "number", placeholder: "5", units: ["years","months","days"], defaultUnit: "years" },
  ],

  run: ({ principal, rate, time, timeUnit = "years" }) => {
    let P = parseFloat(principal);
    let R = parseFloat(rate);
    let T = parseFloat(time);

    if (timeUnit === "months") T = T / 12;
    if (timeUnit === "days")   T = T / 365;

    if (!P || !R || !T) throw new Error("Principal, rate and time are required");

    const SI     = (P * R * T) / 100;
    const total  = P + SI;
    const daily  = SI / (T * 365);

    // Compound comparison
    const CI     = P * (Math.pow(1 + R/100, T)) - P;
    const diff   = CI - SI;

    const yearByYear = Array.from({ length: Math.min(Math.ceil(T), 30) }, (_, i) => {
      const yr = i + 1;
      return {
        year:     yr,
        simple:   Math.round(P + (P * R * yr) / 100),
        compound: Math.round(P * Math.pow(1 + R/100, yr)),
      };
    });

    return {
      simple_interest:  `₹${SI.toFixed(2)}`,
      total_amount:     `₹${total.toFixed(2)}`,
      daily_interest:   `₹${daily.toFixed(2)}`,
      compound_equiv:   `₹${CI.toFixed(2)}`,
      ci_advantage:     `₹${diff.toFixed(2)}`,
      interest_ratio:   `${((SI/P)*100).toFixed(2)}%`,
      year_by_year:     yearByYear,
    };
  },
};
