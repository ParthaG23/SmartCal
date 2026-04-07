export default {
  name: "Pregnancy Due Date", slug: "pregnancy-due-date", category: "Health",
  description: "Calculates estimated delivery date and pregnancy milestones using Naegele's rule",
  fields: [
    { name: "lmpDate", label: "Last Menstrual Period (Date)", type: "date" },
    { name: "cycleLength", label: "Average Cycle Length (days)", type: "number", placeholder: "28" }
  ],
  run: ({ lmpDate, cycleLength = 28 }) => {
    if (!lmpDate) throw new Error("Last menstrual period date is required");
    const lmp = new Date(lmpDate), cycle = parseFloat(cycleLength) || 28;
    const adjust = cycle - 28;
    const dueDate = new Date(lmp.getTime() + (280 + adjust) * 86400000);
    const today = new Date();
    const daysSinceLMP = Math.floor((today - lmp) / 86400000);
    const weeksPregnant = Math.floor(daysSinceLMP / 7);
    const daysExtra = daysSinceLMP % 7;
    const daysRemaining = Math.max(0, Math.ceil((dueDate - today) / 86400000));
    const trimester = weeksPregnant < 13 ? "First (Weeks 1-12)" : weeksPregnant < 27 ? "Second (Weeks 13-26)" : "Third (Weeks 27-40)";
    const fmt = d => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    return {
      estimated_due_date: fmt(dueDate),
      current_week: weeksPregnant + " weeks, " + daysExtra + " days",
      trimester: trimester,
      days_remaining: daysRemaining + " days",
      progress: ((daysSinceLMP / 280) * 100).toFixed(1) + "%",
      conception_estimate: fmt(new Date(lmp.getTime() + 14 * 86400000)),
      first_ultrasound: fmt(new Date(lmp.getTime() + 56 * 86400000)),
      viability_milestone: fmt(new Date(lmp.getTime() + 168 * 86400000))
    };
  }
};