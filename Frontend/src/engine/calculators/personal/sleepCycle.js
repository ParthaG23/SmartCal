export default {
  name: "Sleep Cycle Calculator", slug: "sleep-cycle", category: "Personal",
  description: "Determines optimal bedtimes and wake times based on 90-minute REM sleep cycles",
  fields: [
    { name: "wakeTime", label: "Desired Wake Time (HH:MM)", type: "text", placeholder: "06:30" },
    { name: "fallAsleepMinutes", label: "Time to Fall Asleep (min)", type: "number", placeholder: "15" }
  ],
  run: ({ wakeTime, fallAsleepMinutes = 15 }) => {
    if (!wakeTime) throw new Error("Wake time is required");
    const [hh, mm] = wakeTime.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) throw new Error("Use HH:MM format (e.g. 06:30)");
    const fallAsleep = parseInt(fallAsleepMinutes) || 15;
    const wakeMinutes = hh * 60 + mm;
    const fmt = (totalMin) => {
      let h = Math.floor(((totalMin % 1440) + 1440) % 1440 / 60);
      let m = ((totalMin % 1440) + 1440) % 1440 % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return h + ":" + String(m).padStart(2, "0") + " " + ampm;
    };
    const cycles = [6, 5, 4, 3];
    const bedtimes = cycles.map(c => {
      const sleepMin = wakeMinutes - (c * 90) - fallAsleep;
      return { cycles: c, hours: (c * 1.5).toFixed(1) + " hrs", bedtime: fmt(sleepMin) };
    });
    return {
      recommended_6_cycles: bedtimes[0].bedtime + " (9 hrs — ideal)",
      recommended_5_cycles: bedtimes[1].bedtime + " (7.5 hrs — great)",
      recommended_4_cycles: bedtimes[2].bedtime + " (6 hrs — okay)",
      minimum_3_cycles: bedtimes[3].bedtime + " (4.5 hrs — minimum)",
      fall_asleep_time: fallAsleep + " minutes",
      wake_up_at: fmt(wakeMinutes),
      cycle_length: "90 minutes each",
      tip: "Waking between cycles prevents grogginess"
    };
  }
};