export default {
  name: "Screen Time Aggregator", slug: "screen-time", category: "Personal",
  description: "Visualizes how daily screen hours accumulate over weeks, months, and years",
  fields: [
    { name: "dailyHours", label: "Daily Screen Time (hours)", type: "number", placeholder: "6" }
  ],
  run: ({ dailyHours }) => {
    const h = parseFloat(dailyHours);
    if (!h) throw new Error("Daily hours required");
    const weekly = h * 7, monthly = h * 30.44, yearly = h * 365;
    const yearlyDays = yearly / 24;
    const lifetimeYears = (yearly * 50) / 8760;
    return {
      daily: h.toFixed(1) + " hours",
      weekly: weekly.toFixed(0) + " hours",
      monthly: monthly.toFixed(0) + " hours",
      yearly: yearly.toFixed(0) + " hours",
      yearly_days: yearlyDays.toFixed(1) + " full days",
      yearly_weeks: (yearlyDays / 7).toFixed(1) + " weeks",
      lifetime_estimate: lifetimeYears.toFixed(1) + " years (over 50 yrs)",
      pct_of_waking: ((h / 16) * 100).toFixed(1) + "% of waking hours"
    };
  }
};