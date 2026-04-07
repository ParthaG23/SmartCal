export default {
  name: "BMR Calculator", slug: "bmr", category: "Health",
  description: "Basal Metabolic Rate using the Mifflin-St Jeor equation for daily calorie needs at rest",
  fields: [
    { name: "weight", label: "Weight", type: "number", placeholder: "70", units: ["kg","lb"], defaultUnit: "kg" },
    { name: "height", label: "Height", type: "number", placeholder: "175", units: ["cm","ft"], defaultUnit: "cm" },
    { name: "age", label: "Age (years)", type: "number", placeholder: "25" },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }
    ]}
  ],
  run: ({ weight, height, age, gender, weightUnit = "kg", heightUnit = "cm" }) => {
    let w = parseFloat(weight), h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) throw new Error("Weight, height, and age are required");
    if (weightUnit === "lb") w *= 0.453592;
    if (heightUnit === "ft") h *= 30.48;
    const bmr = gender === "female"
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5;
    return {
      bmr_calories: bmr.toFixed(0) + " kcal/day",
      hourly_burn: (bmr / 24).toFixed(1) + " kcal/hr",
      weekly_bmr: (bmr * 7).toFixed(0) + " kcal",
      sedentary_tdee: (bmr * 1.2).toFixed(0) + " kcal",
      light_active_tdee: (bmr * 1.375).toFixed(0) + " kcal",
      moderate_tdee: (bmr * 1.55).toFixed(0) + " kcal",
      very_active_tdee: (bmr * 1.725).toFixed(0) + " kcal",
      athlete_tdee: (bmr * 1.9).toFixed(0) + " kcal"
    };
  }
};