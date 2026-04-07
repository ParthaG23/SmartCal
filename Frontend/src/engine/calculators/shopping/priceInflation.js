export default {
  name: "Price Inflation Adjuster", slug: "price-inflation", category: "Shopping",
  description: "Adjusts historical prices to current value accounting for inflation",
  fields: [
    { name: "oldPrice", label: "Old Price (₹)", type: "number", placeholder: "100" },
    { name: "oldYear", label: "Year of Purchase", type: "number", placeholder: "2010" },
    { name: "currentYear", label: "Current Year", type: "number", placeholder: "2024" },
    { name: "inflationRate", label: "Avg Inflation Rate (%)", type: "number", placeholder: "6" }
  ],
  run: ({ oldPrice, oldYear, currentYear, inflationRate }) => {
    const price = parseFloat(oldPrice), y1 = parseInt(oldYear), y2 = parseInt(currentYear), r = parseFloat(inflationRate) / 100;
    if (!price || !y1 || !y2) throw new Error("Price and years required");
    const years = y2 - y1;
    const adjusted = price * Math.pow(1 + r, years);
    const pctIncrease = ((adjusted - price) / price) * 100;
    return {
      original_price: price.toFixed(2) + " (" + y1 + ")",
      adjusted_price: adjusted.toFixed(2) + " (" + y2 + ")",
      price_increase: (adjusted - price).toFixed(2),
      percentage_increase: pctIncrease.toFixed(1) + "%",
      multiplier: (adjusted / price).toFixed(2) + "x",
      years_elapsed: years + " years",
      annual_increase: (r * 100).toFixed(1) + "% per year"
    };
  }
};