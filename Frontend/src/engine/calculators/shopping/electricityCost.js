export default {
  name: "Electricity Cost Calculator", slug: "electricity-cost", category: "Shopping",
  description: "Estimates monthly and yearly electricity cost for appliances",
  fields: [
    { name: "wattage", label: "Appliance Wattage (W)", type: "number", placeholder: "1000" },
    { name: "hoursPerDay", label: "Usage Hours per Day", type: "number", placeholder: "8" },
    { name: "daysPerMonth", label: "Days per Month", type: "number", placeholder: "30" },
    { name: "ratePerKwh", label: "Electricity Rate (₹/kWh)", type: "number", placeholder: "7" }
  ],
  run: ({ wattage, hoursPerDay, daysPerMonth = 30, ratePerKwh }) => {
    const w = parseFloat(wattage), h = parseFloat(hoursPerDay), d = parseFloat(daysPerMonth) || 30, r = parseFloat(ratePerKwh);
    if (!w || !h || !r) throw new Error("Wattage, hours, and rate required");
    const dailyKwh = (w * h) / 1000, monthlyKwh = dailyKwh * d, yearlyKwh = dailyKwh * 365;
    const dailyCost = dailyKwh * r, monthlyCost = monthlyKwh * r, yearlyCost = yearlyKwh * r;
    return {
      daily_consumption: dailyKwh.toFixed(2) + " kWh",
      monthly_consumption: monthlyKwh.toFixed(2) + " kWh",
      daily_cost: dailyCost.toFixed(2),
      monthly_cost: monthlyCost.toFixed(2),
      yearly_cost: yearlyCost.toFixed(0),
      cost_per_hour: (w / 1000 * r).toFixed(2) + " per hour",
      co2_monthly: (monthlyKwh * 0.82).toFixed(1) + " kg CO₂"
    };
  }
};