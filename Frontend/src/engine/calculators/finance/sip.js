export default {
  name: "SIP Calculator", slug: "sip", category: "Finance",
  description: "Systematic Investment Plan projections with compounding growth and wealth ratio",
  fields: [
    { name: "monthlyInvestment", label: "Monthly Investment (₹)", type: "number", placeholder: "5000" },
    { name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", placeholder: "12" },
    { name: "years", label: "Investment Period (Years)", type: "number", placeholder: "10" }
  ],
  run: ({ monthlyInvestment, expectedReturn, years }) => {
    const P = parseFloat(monthlyInvestment), annualR = parseFloat(expectedReturn), Y = parseFloat(years);
    if (!P || !annualR || !Y) throw new Error("All fields are required");
    const r = annualR / 100 / 12, n = Y * 12;
    const FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n, returns = FV - totalInvested;
    const stepUpFV = P * 1.1 * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return {
      monthly_investment: P.toFixed(0),
      total_invested: totalInvested.toFixed(0),
      estimated_returns: returns.toFixed(0),
      total_value: FV.toFixed(0),
      wealth_ratio: (FV / totalInvested).toFixed(2) + "x",
      absolute_return: ((returns / totalInvested) * 100).toFixed(1) + "%",
      with_10pct_stepup: stepUpFV.toFixed(0),
      cagr: (annualR).toFixed(1) + "% p.a."
    };
  }
};