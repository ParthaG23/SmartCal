export default {
  name: "Wedding / Event Budgeter", slug: "event-budget", category: "Personal",
  description: "Allocates your total event budget across key categories with recommendations",
  fields: [
    { name: "totalBudget", label: "Total Budget (₹)", type: "number", placeholder: "500000" },
    { name: "venuePct", label: "Venue (%)", type: "number", placeholder: "30" },
    { name: "cateringPct", label: "Catering (%)", type: "number", placeholder: "30" },
    { name: "decorPct", label: "Decor & Flowers (%)", type: "number", placeholder: "15" },
    { name: "photographyPct", label: "Photography (%)", type: "number", placeholder: "10" },
    { name: "entertainmentPct", label: "Entertainment (%)", type: "number", placeholder: "10" }
  ],
  run: ({ totalBudget, venuePct = 30, cateringPct = 30, decorPct = 15, photographyPct = 10, entertainmentPct = 10 }) => {
    const budget = parseFloat(totalBudget);
    if (!budget) throw new Error("Total budget required");
    const v = parseFloat(venuePct)||30, c = parseFloat(cateringPct)||30, d = parseFloat(decorPct)||15;
    const p = parseFloat(photographyPct)||10, e = parseFloat(entertainmentPct)||10;
    const used = v + c + d + p + e, misc = Math.max(0, 100 - used);
    return {
      venue: (budget * v / 100).toFixed(0) + " (" + v + "%)",
      catering: (budget * c / 100).toFixed(0) + " (" + c + "%)",
      decor_flowers: (budget * d / 100).toFixed(0) + " (" + d + "%)",
      photography: (budget * p / 100).toFixed(0) + " (" + p + "%)",
      entertainment: (budget * e / 100).toFixed(0) + " (" + e + "%)",
      miscellaneous: (budget * misc / 100).toFixed(0) + " (" + misc + "%)",
      total_allocated: (budget * used / 100).toFixed(0),
      budget_status: used > 100 ? "⚠️ Over budget by " + (used - 100) + "%" : used === 100 ? "✅ Fully allocated" : "✅ " + misc + "% buffer remaining"
    };
  }
};