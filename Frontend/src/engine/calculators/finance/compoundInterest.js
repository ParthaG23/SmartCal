export default {
  name: "Compound Interest",
  slug: "compoundInterest",
  category: "Finance",
  description: "Compound growth with inflation adjustment, CAGR, and real returns",

  fields: [
    {
      name: "principal",
      label: "Principal Amount",
      type: "number",
      placeholder: "10000",
      units: ["₹", "$", "€", "£"],
      defaultUnit: "₹",
    },
    {
      name: "rate",
      label: "Annual Interest Rate",
      type: "number",
      placeholder: "10",
      hint: "Enter rate as percentage e.g. 10 for 10%",
    },
    {
      name: "time",
      label: "Time Period",
      type: "number",
      placeholder: "5",
      units: ["years", "months"],
      defaultUnit: "years",
    },
    {
      name: "n",
      label: "Compounding Frequency",
      type: "select",
      options: [
        { value: "1",    label: "Annually"   },
        { value: "2",    label: "Semi-Annually" },
        { value: "4",    label: "Quarterly"  },
        { value: "12",   label: "Monthly"    },
        { value: "365",  label: "Daily"      },
      ],
      defaultUnit: "12",
    },
    {
      name: "inflation",
      label: "Inflation Rate (optional)",
      type: "number",
      placeholder: "6",
      hint: "Enter 0 to skip inflation adjustment",
    },
    {
      name: "monthlyDeposit",
      label: "Monthly Deposit (optional)",
      type: "number",
      placeholder: "0",
      hint: "Additional amount added each month",
    },
  ],

  run: ({ principal, rate, time, n = "12", inflation = 0, monthlyDeposit = 0, timeUnit = "years" }) => {
    let p   = parseFloat(principal);
    let r   = parseFloat(rate);
    let t   = parseFloat(time);
    const freq  = parseInt(n, 10) || 12;
    const inf   = parseFloat(inflation) || 0;
    const md    = parseFloat(monthlyDeposit) || 0;

    if (timeUnit === "months") t = t / 12;
    if (!p || !r || !t) throw new Error("Principal, rate and time are required");

    const A         = p * Math.pow(1 + r / 100 / freq, freq * t);
    const interest  = A - p;

    let sipFinal = A;
    if (md > 0) {
      const monthlyRate = r / 100 / 12;
      const months      = t * 12;
      sipFinal = A + md * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const realRate  = ((1 + r/100) / (1 + inf/100) - 1) * 100;
    const realFinal = p * Math.pow(1 + realRate/100, t);

    const cagr = (Math.pow(A / p, 1 / t) - 1) * 100;

    const doublingYears = (72 / r).toFixed(1);

    const ear = (Math.pow(1 + r/100/freq, freq) - 1) * 100;

    const yearlyBreakdown = Array.from({ length: Math.min(Math.ceil(t), 30) }, (_, i) => {
      const yr  = i + 1;
      const amt = p * Math.pow(1 + r/100/freq, freq*yr) + (md > 0
        ? md * ((Math.pow(1 + r/100/12, yr*12) - 1) / (r/100/12))
        : 0);
      return { year: yr, amount: Math.round(amt), interest: Math.round(amt - p) };
    });

    return {
      final_amount:       `₹${A.toFixed(2)}`,
      total_interest:     `₹${interest.toFixed(2)}`,
      interest_percent:   `${((interest / p) * 100).toFixed(2)}%`,
      with_monthly_sip:   md > 0 ? `₹${sipFinal.toFixed(2)}` : "N/A",
      real_return_value:  `₹${realFinal.toFixed(2)}`,
      cagr:               `${cagr.toFixed(2)}%`,
      effective_annual_rate: `${ear.toFixed(4)}%`,
      doubling_time:      `${doublingYears} years`,
      yearly_breakdown:   yearlyBreakdown,
    };
  },
};
