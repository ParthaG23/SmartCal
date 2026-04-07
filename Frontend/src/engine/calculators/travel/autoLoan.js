export default {
  name: "Auto Loan Calculator", slug: "auto-loan", category: "Travel",
  description: "Calculates monthly payments and total cost for vehicle financing",
  fields: [
    { name: "vehiclePrice", label: "Vehicle Price (₹)", type: "number", placeholder: "800000" },
    { name: "downPayment", label: "Down Payment (₹)", type: "number", placeholder: "200000" },
    { name: "loanTerm", label: "Loan Term (months)", type: "number", placeholder: "60" },
    { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", placeholder: "9" }
  ],
  run: ({ vehiclePrice, downPayment = 0, loanTerm, interestRate }) => {
    const price = parseFloat(vehiclePrice), dp = parseFloat(downPayment) || 0;
    const n = parseFloat(loanTerm), rate = parseFloat(interestRate);
    if (!price || !n || !rate) throw new Error("Vehicle price, term, and rate required");
    const loan = price - dp, r = rate / 100 / 12;
    const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n, totalInterest = totalPayment - loan;
    return {
      loan_amount: loan.toFixed(0),
      monthly_payment: emi.toFixed(0),
      total_interest: totalInterest.toFixed(0),
      total_cost: (totalPayment + dp).toFixed(0),
      interest_pct: ((totalInterest / loan) * 100).toFixed(1) + "%",
      down_payment: dp.toFixed(0),
      loan_to_value: ((loan / price) * 100).toFixed(1) + "%"
    };
  }
};