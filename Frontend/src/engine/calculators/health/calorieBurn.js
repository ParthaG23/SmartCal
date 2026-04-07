export default {
  name: "Caloric Burn Calculator", slug: "calorie-burn", category: "Health",
  description: "Estimates calories burned based on activity type, intensity, and body weight",
  fields: [
    { name: "activity", label: "Activity", type: "select", options: [
      { value: "3.5", label: "Walking (normal)" }, { value: "7", label: "Jogging" },
      { value: "9.8", label: "Running (fast)" }, { value: "7.5", label: "Cycling" },
      { value: "8", label: "Swimming" }, { value: "3", label: "Yoga" },
      { value: "6", label: "Weight Training" }, { value: "4.5", label: "Dancing" },
      { value: "10", label: "Jump Rope" }, { value: "5", label: "Hiking" }
    ]},
    { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "70" },
    { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "30" }
  ],
  run: ({ activity, weight, duration }) => {
    const met = parseFloat(activity) || 3.5, w = parseFloat(weight), d = parseFloat(duration);
    if (!w || !d) throw new Error("Weight and duration required");
    const cal = met * w * (d / 60) * 1.05;
    const fatG = cal / 7.7;
    return {
      calories_burned: cal.toFixed(0) + " kcal",
      met_value: met.toFixed(1),
      fat_burned: fatG.toFixed(1) + " g",
      per_minute: (cal / d).toFixed(1) + " kcal/min",
      equivalent_steps: Math.round(cal / 0.04) + " steps",
      food_equivalent: cal < 150 ? "~ 1 banana" : cal < 300 ? "~ 1 chapati" : cal < 500 ? "~ 1 samosa + chai" : "~ a full meal",
      weekly_if_daily: (cal * 7).toFixed(0) + " kcal"
    };
  }
};