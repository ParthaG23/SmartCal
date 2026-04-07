export default {
  name: "Sales Tax Tool", slug: "sales-tax", category: "Shopping",
  description: "Computes final prices with sales tax or extracts tax from an inclusive price",
  fields: [
    { name: "price", label: "Price (₹)", type: "number", placeholder: "1000" },
    { name: "taxRate", label: "Tax Rate (%)", type: "number", placeholder: "18" },
    { name: "mode", label: "Mode", type: "select", options: [
      { value: "exclusive", label: "Add tax to price" }, { value: "inclusive", label: "Extract tax from price" }
    ]}
  ],
  run: ({ price, taxRate, mode = "exclusive" }) => {
    const p = parseFloat(price), r = parseFloat(taxRate);
    if (!p || !r) throw new Error("Price and tax rate required");
    let base, tax, total;
    if (mode === "inclusive") { base = p / (1 + r / 100); tax = p - base; total = p; }
    else { base = p; tax = p * r / 100; total = p + tax; }
    return {
      base_price: base.toFixed(2),
      tax_amount: tax.toFixed(2),
      total_price: total.toFixed(2),
      tax_rate: r + "%",
      effective_cost: ((tax / base) * 100).toFixed(2) + "%",
      tax_per_100: (r).toFixed(2) + " per 100"
    };
  }
};