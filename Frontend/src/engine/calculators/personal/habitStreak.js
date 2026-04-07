export default {
  name: "Habit Streak Projector", slug: "habit-streak", category: "Personal",
  description: "Projects when you will hit key streak milestones for daily habits",
  fields: [
    { name: "startDate", label: "Habit Start Date", type: "date" },
    { name: "targetDays", label: "Target Streak (days)", type: "number", placeholder: "100" }
  ],
  run: ({ startDate, targetDays }) => {
    if (!startDate) throw new Error("Start date required");
    const start = new Date(startDate), target = parseInt(targetDays) || 100;
    const today = new Date();
    const daysSoFar = Math.max(0, Math.floor((today - start) / 86400000));
    const daysRemaining = Math.max(0, target - daysSoFar);
    const targetDate = new Date(start.getTime() + target * 86400000);
    const fmt = d => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const pct = Math.min(100, (daysSoFar / target) * 100);
    const milestones = [7,21,30,60,90,100,200,365].filter(m => m >= daysSoFar).slice(0, 4);
    return {
      days_completed: daysSoFar + " days ✅",
      days_remaining: daysRemaining + " days",
      target_date: fmt(targetDate),
      progress: pct.toFixed(1) + "%",
      current_streak: daysSoFar + " days",
      next_milestones: milestones.map(m => m + " days → " + fmt(new Date(start.getTime() + m * 86400000))).join(" | "),
      weeks_completed: Math.floor(daysSoFar / 7) + " weeks",
      status: daysSoFar >= target ? "🎉 Goal Achieved!" : "🔥 Keep Going!"
    };
  }
};