export default {
  name: "Income Tax Calculator", slug: "income-tax", category: "Finance",
  description: "Estimates income tax liability under new and old regimes with deductions",
  fields: [
    { name: "annualIncome", label: "Annual Gross Income (₹)", type: "number", placeholder: "1200000" },
    { name: "deductions", label: "Total Deductions (₹)", type: "number", placeholder: "150000" },
    { name: "regime", label: "Tax Regime", type: "select", options: [
      { value: "new", label: "New Regime (2024)" }, { value: "old", label: "Old Regime" }
    ]}
  ],
  run: ({ annualIncome, deductions = 0, regime = "new" }) => {
    const income = parseFloat(annualIncome), ded = parseFloat(deductions) || 0;
    if (!income) throw new Error("Annual income is required");
    const taxable = regime === "old" ? Math.max(0, income - ded) : Math.max(0, income - 75000);
    let tax = 0;
    if (regime === "new") {
      const slabs = [[300000,0],[400000,0.05],[500000,0.05],[600000,0.1],[700000,0.1],[800000,0.1],[900000,0.1],[1000000,0.15],[1000000,0.15],[1200000,0.2],[Infinity,0.3]];
      let rem = taxable, prev = 0;
      const brackets = [[300000,0],[600000,0.05],[900000,0.10],[1200000,0.15],[1500000,0.20],[Infinity,0.30]];
      rem = taxable;
      for (const [limit, rate] of brackets) {
        const slab = Math.min(rem, limit - prev);
        if (slab > 0) tax += slab * rate;
        rem -= slab; prev = limit;
        if (rem <= 0) break;
      }
    } else {
      const brackets = [[250000,0],[500000,0.05],[1000000,0.20],[Infinity,0.30]];
      let rem = taxable, prev = 0;
      for (const [limit, rate] of brackets) {
        const slab = Math.min(rem, limit - prev);
        if (slab > 0) tax += slab * rate;
        rem -= slab; prev = limit;
        if (rem <= 0) break;
      }
    }
    const cess = tax * 0.04, totalTax = tax + cess;
    const effectiveRate = income > 0 ? (totalTax / income * 100) : 0;
    return {
      gross_income: income.toFixed(0),
      taxable_income: taxable.toFixed(0),
      income_tax: tax.toFixed(0),
      cess_4pct: cess.toFixed(0),
      total_tax: totalTax.toFixed(0),
      effective_rate: effectiveRate.toFixed(2) + "%",
      monthly_tax: (totalTax / 12).toFixed(0),
      take_home_monthly: ((income - totalTax) / 12).toFixed(0)
    };
  }
};