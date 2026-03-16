module.exports = {
  name: "EMI Calculator",
  slug: "emi",
  category: "Finance",
  description: "Loan EMI with full amortisation schedule, prepayment savings and affordability check",

  fields: [
    {
      name: "principal",
      label: "Loan Amount",
      type: "number",
      placeholder: "500000",
      units: ["₹", "$", "€", "£"],
      defaultUnit: "₹",
    },
    {
      name: "rate",
      label: "Annual Interest Rate (%)",
      type: "number",
      placeholder: "8.5",
    },
    {
      name: "tenure",
      label: "Loan Tenure",
      type: "number",
      placeholder: "60",
      units: ["months", "years"],
      defaultUnit: "months",
    },
    {
      name: "prepayment",
      label: "One-time Prepayment (optional)",
      type: "number",
      placeholder: "0",
      hint: "Extra lump-sum payment to reduce loan",
    },
    {
      name: "prepaymentMonth",
      label: "Prepayment at Month # (optional)",
      type: "number",
      placeholder: "12",
    },
  ],

  run: ({ principal, rate, tenure, prepayment = 0, prepaymentMonth = 0, tenureUnit = "months" }) => {
    let P  = parseFloat(principal);
    const r  = parseFloat(rate) / (12 * 100);
    let   N  = parseFloat(tenure);
    const pp = parseFloat(prepayment)      || 0;
    const pm = parseInt(prepaymentMonth,10) || 0;

    if (tenureUnit === "years") N = N * 12;
    if (!P || !rate || !N) throw new Error("Loan amount, rate, and tenure are required");

    // ── Standard EMI ──
    const emi         = P * r * Math.pow(1+r, N) / (Math.pow(1+r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    // ── Amortisation schedule (monthly, capped at 360) ──
    let   balance = P;
    let   totalIntPaid = 0;
    const schedule = [];
    let   prepaymentSaving = 0;
    let   newTenure = N;

    for (let m = 1; m <= N; m++) {
      const intComp = balance * r;
      const prinComp = emi - intComp;
      totalIntPaid += intComp;

      if (m === pm && pp > 0) {
        balance -= pp;
        prepaymentSaving = totalInterest - totalIntPaid - (balance * r * Math.pow(1+r, N-m) / (Math.pow(1+r, N-m)-1)) * (N - m);
        newTenure = m + Math.ceil(Math.log(emi/(emi - balance*r)) / Math.log(1+r));
      }

      balance -= prinComp;
      if (balance < 0) balance = 0;

      if (schedule.length < 360) {
        schedule.push({
          month:     m,
          emi:       Math.round(emi),
          principal: Math.round(prinComp),
          interest:  Math.round(intComp),
          balance:   Math.round(Math.max(0, balance)),
        });
      }
      if (balance <= 0) { newTenure = m; break; }
    }

    // ── Yearly summary ──
    const yearlySummary = [];
    for (let y = 0; y < Math.ceil(N/12); y++) {
      const slice = schedule.slice(y*12, y*12+12);
      yearlySummary.push({
        year:      y + 1,
        principal: slice.reduce((s,r) => s + r.principal, 0),
        interest:  slice.reduce((s,r) => s + r.interest,  0),
        balance:   slice[slice.length-1]?.balance ?? 0,
      });
    }

    return {
      monthly_emi:       `₹${emi.toFixed(2)}`,
      total_payment:     `₹${totalPayment.toFixed(2)}`,
      total_interest:    `₹${totalInterest.toFixed(2)}`,
      interest_ratio:    `${((totalInterest/totalPayment)*100).toFixed(1)}%`,
      prepayment_saving: pp > 0 ? `₹${Math.abs(prepaymentSaving).toFixed(2)}` : "N/A",
      tenure_reduction:  pp > 0 ? `${N - newTenure} months` : "N/A",
      schedule,
      yearly_summary:    yearlySummary,
    };
  },
};
