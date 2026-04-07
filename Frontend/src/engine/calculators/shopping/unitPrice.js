export default {
  name: "Unit Price Comparison", slug: "unit-price", category: "Shopping",
  description: "Compares prices per unit to find the best deal between two products",
  fields: [
    { name: "price1", label: "Product A Price (₹)", type: "number", placeholder: "120" },
    { name: "quantity1", label: "Product A Quantity", type: "number", placeholder: "500" },
    { name: "unit1", label: "Product A Unit", type: "select", options: [
      { value: "g", label: "grams" }, { value: "ml", label: "ml" }, { value: "pcs", label: "pieces" }, { value: "kg", label: "kg" }
    ]},
    { name: "price2", label: "Product B Price (₹)", type: "number", placeholder: "200" },
    { name: "quantity2", label: "Product B Quantity", type: "number", placeholder: "1000" },
    { name: "unit2", label: "Product B Unit", type: "select", options: [
      { value: "g", label: "grams" }, { value: "ml", label: "ml" }, { value: "pcs", label: "pieces" }, { value: "kg", label: "kg" }
    ]}
  ],
  run: ({ price1, quantity1, price2, quantity2 }) => {
    const p1 = parseFloat(price1), q1 = parseFloat(quantity1), p2 = parseFloat(price2), q2 = parseFloat(quantity2);
    if (!p1 || !q1 || !p2 || !q2) throw new Error("All fields required");
    const up1 = p1 / q1, up2 = p2 / q2;
    const better = up1 < up2 ? "Product A" : up1 > up2 ? "Product B" : "Same price";
    const savings = Math.abs(up1 - up2) * Math.max(q1, q2);
    return {
      unit_price_A: up1.toFixed(4) + " per unit",
      unit_price_B: up2.toFixed(4) + " per unit",
      better_deal: better + " ✓",
      savings: savings.toFixed(2) + " saved",
      difference: (Math.abs(up1 - up2) / Math.min(up1, up2) * 100).toFixed(1) + "% cheaper",
      cost_per_100: "A: " + (up1 * 100).toFixed(2) + " / B: " + (up2 * 100).toFixed(2)
    };
  }
};