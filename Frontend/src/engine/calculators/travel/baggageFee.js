export default {
  name: "Baggage Fee Estimator", slug: "baggage-fee", category: "Travel",
  description: "Estimates airline baggage overweight and oversize fees",
  fields: [
    { name: "bagWeight", label: "Bag Weight (kg)", type: "number", placeholder: "28" },
    { name: "allowedWeight", label: "Airline Weight Limit (kg)", type: "number", placeholder: "23" },
    { name: "excessFeePerKg", label: "Excess Fee per kg (₹)", type: "number", placeholder: "500" },
    { name: "bags", label: "Number of Bags", type: "number", placeholder: "1" }
  ],
  run: ({ bagWeight, allowedWeight, excessFeePerKg, bags = 1 }) => {
    const w = parseFloat(bagWeight), limit = parseFloat(allowedWeight), fee = parseFloat(excessFeePerKg), n = parseInt(bags) || 1;
    if (!w || !limit || !fee) throw new Error("Weight, limit, and fee rate required");
    const excess = Math.max(0, w - limit), excessFee = excess * fee * n;
    return {
      bag_weight: w + " kg",
      weight_limit: limit + " kg",
      excess_weight: excess.toFixed(1) + " kg",
      fee_per_bag: (excess * fee).toFixed(0),
      total_fee: excessFee.toFixed(0),
      total_bags: n.toString(),
      status: excess === 0 ? "✅ Within limit" : "⚠️ Overweight by " + excess.toFixed(1) + " kg",
      tip: excess > 0 ? "Consider packing " + excess.toFixed(1) + " kg in carry-on" : "You're good to go!"
    };
  }
};