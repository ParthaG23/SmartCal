export default {
  name: "GST Calculator",
  slug: "gst",
  category: "Finance",
  description: "GST add / remove with CGST, SGST, IGST split and all slab comparisons",

  fields: [
    { name: "amount", label: "Amount", type: "number", placeholder: "1000", units: ["₹", "$", "€"], defaultUnit: "₹" },
    { name: "gstRate", label: "GST Rate (%)", type: "number", placeholder: "18", units: ["5%", "12%", "18%", "28%", "custom"], defaultUnit: "custom", hint: "Standard slabs: 5, 12, 18, 28" },
    { name: "mode", label: "Calculation Mode", type: "select", options: [{ value: "add", label: "Add GST to amount (exclusive)" }, { value: "remove", label: "Remove GST from amount (inclusive)" }] },
    { name: "transactionType", label: "Transaction Type", type: "select", options: [{ value: "intrastate", label: "Intrastate (CGST + SGST)" }, { value: "interstate", label: "Interstate (IGST only)" }] },
  ],

  run: ({ amount, gstRate, mode = "add", transactionType = "intrastate" }) => {
    const amt  = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (!amt || !rate) throw new Error("Amount and GST rate are required");
    if (rate < 0 || rate > 100) throw new Error("GST rate must be between 0 and 100");

    let base, gstAmount, total;

    if (mode === "add") {
      base       = amt;
      gstAmount  = (amt * rate) / 100;
      total      = amt + gstAmount;
    } else {
      base       = amt / (1 + rate / 100);
      gstAmount  = amt - base;
      total      = amt;
    }

    const half = gstAmount / 2;

    const slabs = [0, 5, 12, 18, 28].map(r => ({
      slab:  `${r}%`,
      base:  Math.round(base),
      gst:   Math.round((base * r) / 100),
      total: Math.round(base + (base * r) / 100),
    }));

    const categoryHints =
      rate === 5  ? "Household necessities, some services"  :
      rate === 12 ? "Processed foods, computers, business services" :
      rate === 18 ? "Most goods & services, restaurants"    :
      rate === 28 ? "Luxury goods, automobiles, tobacco"    :
      "Custom rate";

    return {
      base_amount:   `₹${base.toFixed(2)}`,
      gst_amount:    `₹${gstAmount.toFixed(2)}`,
      total_amount:  `₹${total.toFixed(2)}`,
      cgst:          transactionType === "intrastate" ? `₹${half.toFixed(2)}` : "N/A",
      sgst:          transactionType === "intrastate" ? `₹${half.toFixed(2)}` : "N/A",
      igst:          transactionType === "interstate" ? `₹${gstAmount.toFixed(2)}` : "N/A",
      gst_rate:      `${rate}%`,
      category_hint: categoryHints,
      slab_comparison: slabs,
    };
  },
};
