export default {
  name: "Coupon Stacking Tool", slug: "coupon-stack", category: "Shopping",
  description: "Calculates final prices when applying multiple sequential discounts",
  fields: [
    { name: "originalPrice", label: "Original Price (₹)", type: "number", placeholder: "2000" },
    { name: "discount1", label: "First Discount (%)", type: "number", placeholder: "20" },
    { name: "discount2", label: "Second Discount (%)", type: "number", placeholder: "10" },
    { name: "discount3", label: "Third Discount (%, optional)", type: "number", placeholder: "5" }
  ],
  run: ({ originalPrice, discount1, discount2, discount3 = 0 }) => {
    const p = parseFloat(originalPrice), d1 = parseFloat(discount1) || 0, d2 = parseFloat(discount2) || 0, d3 = parseFloat(discount3) || 0;
    if (!p) throw new Error("Original price required");
    const after1 = p * (1 - d1 / 100);
    const after2 = after1 * (1 - d2 / 100);
    const after3 = d3 ? after2 * (1 - d3 / 100) : after2;
    const totalSaved = p - after3;
    const effectiveDiscount = (totalSaved / p) * 100;
    const singleEquivalent = (1 - Math.pow(1 - d1/100, 1) * Math.pow(1 - d2/100, 1) * Math.pow(1 - d3/100, 1)) * 100;
    return {
      after_first_discount: after1.toFixed(2),
      after_second_discount: after2.toFixed(2),
      final_price: after3.toFixed(2),
      total_savings: totalSaved.toFixed(2),
      effective_discount: effectiveDiscount.toFixed(2) + "%",
      equivalent_single_discount: singleEquivalent.toFixed(2) + "%",
      you_pay: ((after3 / p) * 100).toFixed(1) + "% of original"
    };
  }
};