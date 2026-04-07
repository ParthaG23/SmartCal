export default {
  name: "Work & Power Calculator", slug: "work-power", category: "Science",
  description: "Calculates mechanical work done and power output",
  fields: [
    { name: "force", label: "Force (N)", type: "number", placeholder: "100" },
    { name: "distance", label: "Distance (m)", type: "number", placeholder: "10" },
    { name: "time", label: "Time (seconds)", type: "number", placeholder: "5" }
  ],
  run: ({ force, distance, time }) => {
    const F = parseFloat(force), d = parseFloat(distance), t = parseFloat(time);
    if (!F || !d) throw new Error("Force and distance required");
    const W = F * d, P = t ? W / t : 0;
    return {
      work_done: W.toFixed(2) + " J",
      work_kj: (W / 1000).toFixed(4) + " kJ",
      power: P.toFixed(2) + " W",
      power_hp: (P / 745.7).toFixed(4) + " HP",
      power_kw: (P / 1000).toFixed(4) + " kW",
      energy_calories: (W / 4.184).toFixed(2) + " cal",
      energy_kwh: (W / 3600000).toFixed(6) + " kWh"
    };
  }
};