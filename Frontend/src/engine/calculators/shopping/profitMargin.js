export default {
  name: "Profit Margin & Markup", slug: "profit-margin", category: "Shopping",
  description: "Calculates profit margin, markup percentage, and break-even analysis",
  fields: [
    { name: "costPrice", label: "Cost Price (₹)", type: "number", placeholder: "500" },
    { name: "sellingPrice", label: "Selling Price (₹)", type: "number", placeholder: "750" }
  ],
  run: ({ costPrice, sellingPrice }) => {
    const cp = parseFloat(costPrice), sp = parseFloat(sellingPrice);
    if (!cp || !sp) throw new Error("Both prices required");
    const profit = sp - cp, margin = (profit / sp) * 100, markup = (profit / cp) * 100;
    return {
      profit: profit.toFixed(2),
      profit_margin: margin.toFixed(2) + "%",
      markup: markup.toFixed(2) + "%",
      cost_ratio: ((cp / sp) * 100).toFixed(1) + "%",
      revenue_multiplier: (sp / cp).toFixed(3) + "x",
      break_even_units: "1 unit at " + sp.toFixed(2),
      status: profit >= 0 ? "Profitable ✅" : "Loss ❌"
    };
  }
};