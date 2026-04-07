export default {
  name: "BOGO Calculator", slug: "bogo", category: "Shopping",
  description: "Calculates the real discount in Buy One Get One and similar deals",
  fields: [
    { name: "itemPrice", label: "Item Price (₹)", type: "number", placeholder: "500" },
    { name: "dealType", label: "Deal Type", type: "select", options: [
      { value: "b1g1", label: "Buy 1 Get 1 Free" }, { value: "b2g1", label: "Buy 2 Get 1 Free" },
      { value: "b1g50", label: "Buy 1 Get 1 at 50% Off" }, { value: "b3g1", label: "Buy 3 Get 1 Free" }
    ]},
    { name: "quantity", label: "Quantity Buying", type: "number", placeholder: "4" }
  ],
  run: ({ itemPrice, dealType, quantity = 2 }) => {
    const price = parseFloat(itemPrice), qty = parseInt(quantity) || 2;
    if (!price) throw new Error("Item price is required");
    const regular = price * qty;
    let dealTotal, freeItems;
    if (dealType === "b1g1") { freeItems = Math.floor(qty / 2); dealTotal = (qty - freeItems) * price; }
    else if (dealType === "b2g1") { freeItems = Math.floor(qty / 3); dealTotal = (qty - freeItems) * price; }
    else if (dealType === "b1g50") { const pairs = Math.floor(qty / 2); const singles = qty % 2; dealTotal = pairs * price * 1.5 + singles * price; freeItems = 0; }
    else { freeItems = Math.floor(qty / 4); dealTotal = (qty - freeItems) * price; }
    const saved = regular - dealTotal;
    return {
      regular_total: regular.toFixed(2),
      deal_total: dealTotal.toFixed(2),
      you_save: saved.toFixed(2),
      effective_discount: ((saved / regular) * 100).toFixed(1) + "%",
      effective_price_each: (dealTotal / qty).toFixed(2),
      free_items: (freeItems || 0).toString(),
      cost_per_item: (dealTotal / qty).toFixed(2) + " each"
    };
  }
};