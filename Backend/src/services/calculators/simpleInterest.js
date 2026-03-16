module.exports = {
  name: "Simple Interest",
  slug: "simpleInterest",
  category: "Finance",
  description: "Simple interest with per-period breakdown and comparison with compound interest",

  fields: [
    {
      name: "principal",
      label: "Principal Amount",
      type: "number",
      placeholder: "10000",
      units: ["₹", "$", "€", "£"],
      defaultUnit: "₹",
    },
    {
      name: "rate",
      label: "Rate of Interest",
      type: "number",
      placeholder: "5",
      units: ["% per year", "% per month", "% per day"],
      defaultUnit: "% per year",
    },
    {
      name: "time",
      label: "Time Period",
      type: "number",
      placeholder: "3",
      units: ["years", "months", "days"],
      defaultUnit: "years",
    },
  ],

  run: ({ principal, rate, time, rateUnit = "% per year", timeUnit = "years" }) => {
    let p = parseFloat(principal);
    let r = parseFloat(rate);
    let t = parseFloat(time);

    if (!p || !r || !t) throw new Error("Principal, rate, and time are required");

    // ── Normalise everything to years ──
    if (rateUnit === "% per month") r = r * 12;
    if (rateUnit === "% per day")   r = r * 365;
    if (timeUnit === "months")      t = t / 12;
    if (timeUnit === "days")        t = t / 365;

    const si     = (p * r * t) / 100;
    const total  = p + si;
    const perYear  = (p * r) / 100;
    const perMonth = perYear / 12;
    const perDay   = perYear / 365;

    // ── vs compound interest ──
    const ciAmount   = p * Math.pow(1 + r/100, t);
    const ciInterest = ciAmount - p;
    const difference = ciInterest - si;

    // ── Per-period breakdown ──
    const periods = Math.min(Math.ceil(t), 20);
    const periodBreakdown = Array.from({ length: periods }, (_, i) => ({
      period:    i + 1,
      interest:  Math.round(perYear * (i + 1)),
      total:     Math.round(p + perYear * (i + 1)),
    }));

    return {
      simple_interest:   `₹${si.toFixed(2)}`,
      total_amount:      `₹${total.toFixed(2)}`,
      interest_per_year: `₹${perYear.toFixed(2)}`,
      interest_per_month:`₹${perMonth.toFixed(2)}`,
      interest_per_day:  `₹${perDay.toFixed(4)}`,
      rate_per_year:     `${r.toFixed(4)}%`,
      vs_compound_total: `₹${ciAmount.toFixed(2)}`,
      compound_advantage:`₹${difference.toFixed(2)}`,
      period_breakdown:  periodBreakdown,
    };
  },
};
