export default {
  name: "Water Intake Calculator", slug: "water-intake", category: "Health",
  description: "Determines optimal daily water consumption based on weight, activity, and climate",
  fields: [
    { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "70" },
    { name: "exerciseMinutes", label: "Daily Exercise (minutes)", type: "number", placeholder: "30" },
    { name: "climate", label: "Climate", type: "select", options: [
      { value: "cold", label: "Cold / Temperate" },
      { value: "moderate", label: "Moderate" },
      { value: "hot", label: "Hot / Humid" }
    ]}
  ],
  run: ({ weight, exerciseMinutes = 0, climate = "moderate" }) => {
    const w = parseFloat(weight), ex = parseFloat(exerciseMinutes) || 0;
    if (!w) throw new Error("Body weight is required");
    let base = w * 0.033;
    base += (ex / 30) * 0.35;
    const climateMult = { cold: 0.9, moderate: 1.0, hot: 1.15 };
    const total = base * (climateMult[climate] || 1);
    const glasses = total / 0.25;
    return {
      daily_water: total.toFixed(2) + " litres",
      glasses_250ml: Math.ceil(glasses) + " glasses",
      hourly_intake: (total / 16).toFixed(2) + " L/hr (awake)",
      morning_boost: (total * 0.25).toFixed(2) + " L",
      before_meals: (total * 0.15).toFixed(2) + " L each",
      during_exercise: (ex > 0 ? (ex / 30 * 0.35).toFixed(2) + " L extra" : "N/A"),
      weekly_total: (total * 7).toFixed(1) + " litres"
    };
  }
};