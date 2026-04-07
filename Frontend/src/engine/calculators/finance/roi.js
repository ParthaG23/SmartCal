export default {
  name: "ROI Calculator", slug: "roi", category: "Finance",
  description: "Evaluates the efficiency and profitability of an investment",
  fields: [
    { name: "investmentCost", label: "Investment Cost (₹)", type: "number", placeholder: "100000" },
    { name: "currentValue", label: "Current / Final Value (₹)", type: "number", placeholder: "150000" },
    { name: "years", label: "Investment Period (Years)", type: "number", placeholder: "3" }
  ],
  run: ({ investmentCost, currentValue, years }) => {
    const cost = parseFloat(investmentCost), val = parseFloat(currentValue), y = parseFloat(years) || 1;
    if (!cost || !val) throw new Error("Investment cost and value are required");
    const profit = val - cost, roi = (profit / cost) * 100;
    const annualizedROI = (Math.pow(val / cost, 1 / y) - 1) * 100;
    const doubleTime = 72 / annualizedROI;
    return {
      net_profit: profit.toFixed(0),
      roi_percentage: roi.toFixed(2) + "%",
      annualized_roi: annualizedROI.toFixed(2) + "%",
      profit_factor: (val / cost).toFixed(3) + "x",
      doubling_time: doubleTime.toFixed(1) + " years",
      monthly_return: (annualizedROI / 12).toFixed(2) + "%",
      status: profit >= 0 ? "Profitable ✅" : "Loss ❌"
    };
  }
};