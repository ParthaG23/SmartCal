export default {
  name: "Inflation Calculator", slug: "inflation", category: "Finance",
  description: "Calculates the impact of inflation on purchasing power over time",
  fields: [
    { name: "currentAmount", label: "Current Amount (₹)", type: "number", placeholder: "100000" },
    { name: "inflationRate", label: "Inflation Rate (% p.a.)", type: "number", placeholder: "6" },
    { name: "years", label: "Number of Years", type: "number", placeholder: "10" }
  ],
  run: ({ currentAmount, inflationRate, years }) => {
    const amount = parseFloat(currentAmount), rate = parseFloat(inflationRate) / 100, y = parseFloat(years);
    if (!amount || !rate || !y) throw new Error("All fields are required");
    const futureValue = amount * Math.pow(1 + rate, y);
    const purchasingPower = amount / Math.pow(1 + rate, y);
    const valueLost = amount - purchasingPower;
    const halfLifeYears = Math.log(2) / Math.log(1 + rate);
    return {
      future_cost: futureValue.toFixed(0),
      purchasing_power: purchasingPower.toFixed(0),
      value_eroded: valueLost.toFixed(0),
      erosion_percent: ((valueLost / amount) * 100).toFixed(1) + "%",
      cost_multiplier: (futureValue / amount).toFixed(2) + "x",
      half_life: halfLifeYears.toFixed(1) + " years",
      annual_erosion: (amount * rate).toFixed(0) + " per year"
    };
  }
};