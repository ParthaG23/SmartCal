export default {
  name: "Mortgage Calculator", slug: "mortgage", category: "Finance",
  description: "Advanced home loan calculator with property tax, insurance, and total cost breakdown",
  fields: [
    { name: "homePrice", label: "Home Price (₹)", type: "number", placeholder: "5000000" },
    { name: "downPayment", label: "Down Payment (%)", type: "number", placeholder: "20" },
    { name: "loanTerm", label: "Loan Term (Years)", type: "number", placeholder: "20" },
    { name: "interestRate", label: "Interest Rate (% p.a.)", type: "number", placeholder: "8.5" },
    { name: "propertyTax", label: "Annual Property Tax (₹)", type: "number", placeholder: "12000" },
    { name: "insurance", label: "Annual Insurance (₹)", type: "number", placeholder: "8000" }
  ],
  run: ({ homePrice, downPayment, loanTerm, interestRate, propertyTax = 0, insurance = 0 }) => {
    const price = parseFloat(homePrice), dpPct = parseFloat(downPayment) / 100;
    const years = parseFloat(loanTerm), rate = parseFloat(interestRate);
    const tax = parseFloat(propertyTax) || 0, ins = parseFloat(insurance) || 0;
    if (!price || !years || !rate) throw new Error("Required fields missing");
    const dp = price * dpPct, loan = price - dp;
    const r = rate / 100 / 12, n = years * 12;
    const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n, totalInterest = totalPayment - loan;
    const monthlyTax = tax / 12, monthlyIns = ins / 12;
    const totalMonthly = emi + monthlyTax + monthlyIns;
    return {
      loan_amount: loan.toFixed(0),
      down_payment: dp.toFixed(0),
      monthly_emi: emi.toFixed(0),
      monthly_tax: monthlyTax.toFixed(0),
      monthly_insurance: monthlyIns.toFixed(0),
      total_monthly_payment: totalMonthly.toFixed(0),
      total_interest: totalInterest.toFixed(0),
      total_cost: (totalPayment + tax * years + ins * years + dp).toFixed(0)
    };
  }
};