export default {
  name: "Retirement Savings Calculator", slug: "retirement", category: "Finance",
  description: "Calculates the corpus needed and monthly savings required for a comfortable retirement",
  fields: [
    { name: "currentAge", label: "Current Age", type: "number", placeholder: "30" },
    { name: "retirementAge", label: "Retirement Age", type: "number", placeholder: "60" },
    { name: "monthlyExpense", label: "Current Monthly Expense (₹)", type: "number", placeholder: "40000" },
    { name: "expectedReturn", label: "Expected Return (% p.a.)", type: "number", placeholder: "10" },
    { name: "inflation", label: "Inflation Rate (%)", type: "number", placeholder: "6" }
  ],
  run: ({ currentAge, retirementAge, monthlyExpense, expectedReturn, inflation }) => {
    const age = parseFloat(currentAge), retAge = parseFloat(retirementAge);
    const expense = parseFloat(monthlyExpense), ret = parseFloat(expectedReturn) / 100;
    const inf = parseFloat(inflation) / 100;
    if (!age || !retAge || !expense) throw new Error("Required fields missing");
    const yearsToRetire = retAge - age, yearsAfterRetire = 85 - retAge;
    const futureMonthly = expense * Math.pow(1 + inf, yearsToRetire);
    const futureAnnual = futureMonthly * 12;
    const realReturn = ((1 + ret) / (1 + inf) - 1);
    const corpus = futureAnnual * ((1 - Math.pow(1 + realReturn, -yearsAfterRetire)) / realReturn);
    const r = ret / 12, n = yearsToRetire * 12;
    const monthlySaving = corpus * r / (Math.pow(1 + r, n) - 1);
    return {
      years_to_retire: yearsToRetire.toFixed(0) + " years",
      future_monthly_expense: futureMonthly.toFixed(0),
      future_annual_expense: futureAnnual.toFixed(0),
      required_corpus: corpus.toFixed(0),
      monthly_saving_needed: monthlySaving.toFixed(0),
      total_investment: (monthlySaving * n).toFixed(0),
      wealth_generated: (corpus - monthlySaving * n).toFixed(0),
      post_retire_years: yearsAfterRetire.toFixed(0) + " years"
    };
  }
};