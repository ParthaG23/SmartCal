export default {
  name: "Timesheet / Work Hours", slug: "timesheet", category: "Personal",
  description: "Calculates weekly and monthly earnings from work hours and hourly rate",
  fields: [
    { name: "hoursPerDay", label: "Hours per Day", type: "number", placeholder: "8" },
    { name: "daysPerWeek", label: "Days per Week", type: "number", placeholder: "5" },
    { name: "hourlyRate", label: "Hourly Rate (₹)", type: "number", placeholder: "500" },
    { name: "overtimeHours", label: "Weekly Overtime Hours", type: "number", placeholder: "5" },
    { name: "overtimeMultiplier", label: "Overtime Rate Multiplier", type: "number", placeholder: "1.5" }
  ],
  run: ({ hoursPerDay, daysPerWeek, hourlyRate, overtimeHours = 0, overtimeMultiplier = 1.5 }) => {
    const h = parseFloat(hoursPerDay), d = parseFloat(daysPerWeek), rate = parseFloat(hourlyRate);
    const ot = parseFloat(overtimeHours) || 0, otMult = parseFloat(overtimeMultiplier) || 1.5;
    if (!h || !d || !rate) throw new Error("Hours, days, and rate required");
    const weeklyReg = h * d, weeklyRegPay = weeklyReg * rate;
    const otPay = ot * rate * otMult, weeklyTotal = weeklyRegPay + otPay;
    const monthlyTotal = weeklyTotal * 4.33;
    return {
      weekly_regular_hours: weeklyReg + " hrs",
      weekly_overtime_hours: ot + " hrs",
      regular_pay: weeklyRegPay.toFixed(0) + " / week",
      overtime_pay: otPay.toFixed(0) + " / week",
      total_weekly_pay: weeklyTotal.toFixed(0),
      monthly_estimate: monthlyTotal.toFixed(0),
      annual_estimate: (monthlyTotal * 12).toFixed(0),
      effective_hourly: (weeklyTotal / (weeklyReg + ot)).toFixed(2) + " / hr"
    };
  }
};