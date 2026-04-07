export default {
  name: "Discount Calculator",
  slug: "discount",
  category: "Shopping",
  description: "Discount, final price, tax-inclusive pricing and multi-item bundle savings",

  fields: [
    { name: "originalPrice", label: "Original Price", type: "number", placeholder: "1000", units: ["₹", "$", "€", "£"], defaultUnit: "₹" },
    { name: "discount", label: "Discount", type: "number", placeholder: "20", units: ["%", "flat amount"], defaultUnit: "%" },
    { name: "tax", label: "Tax / GST on final price (%)", type: "number", placeholder: "18", hint: "Enter 0 to skip tax" },
    { name: "quantity", label: "Quantity", type: "number", placeholder: "1" },
  ],

  run: ({ originalPrice, discount, tax = 0, quantity = 1, discountUnit = "%" }) => {
    const op   = parseFloat(originalPrice);
    let   disc = parseFloat(discount) || 0;
    const t    = parseFloat(tax)      || 0;
    const qty  = parseFloat(quantity) || 1;

    if (!op) throw new Error("Original price is required");

    const discountAmount = discountUnit === "flat amount" ? disc : (op * disc) / 100;
    const discountPct    = discountUnit === "flat amount" ? (disc/op)*100 : disc;
    const salePrice      = op - discountAmount;
    if (salePrice < 0) throw new Error("Discount cannot exceed original price");

    const taxAmount      = (salePrice * t) / 100;
    const finalWithTax   = salePrice + taxAmount;

    const totalSaving    = discountAmount * qty;
    const totalFinal     = finalWithTax * qty;
    const totalOriginal  = op * qty;

    const discountSteps  = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70].map(d => ({
      discount: d, price: parseFloat((op * (1 - d/100)).toFixed(2)), saving: parseFloat((op * d / 100).toFixed(2)),
    }));

    const bulkSteps = [1, 2, 5, 10, 20, 50].map(q => ({
      qty: q, total: parseFloat((finalWithTax * q).toFixed(2)),
    }));

    return {
      sale_price:        `₹${salePrice.toFixed(2)}`,
      discount_amount:   `₹${discountAmount.toFixed(2)}`,
      discount_percent:  `${discountPct.toFixed(2)}%`,
      tax_amount:        t > 0 ? `₹${taxAmount.toFixed(2)}` : "N/A",
      final_price:       `₹${finalWithTax.toFixed(2)}`,
      total_for_qty:     qty > 1 ? `₹${totalFinal.toFixed(2)}` : "N/A",
      total_saving:      qty > 1 ? `₹${totalSaving.toFixed(2)}` : `₹${discountAmount.toFixed(2)}`,
      original_total:    qty > 1 ? `₹${totalOriginal.toFixed(2)}` : `₹${op.toFixed(2)}`,
      discount_steps:    discountSteps,
      bulk_steps:        bulkSteps,
    };
  },
};
