export default {
  name: "TDEE Calculator", slug: "tdee", category: "Health",
  description: "Total Daily Energy Expenditure based on activity level for calorie planning",
  fields: [
    { name: "weight", label: "Weight (kg)", type: "number", placeholder: "70" },
    { name: "height", label: "Height (cm)", type: "number", placeholder: "175" },
    { name: "age", label: "Age (years)", type: "number", placeholder: "25" },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }
    ]},
    { name: "activity", label: "Activity Level", type: "select", options: [
      { value: "1.2", label: "Sedentary (desk job)" },
      { value: "1.375", label: "Light (1-3 days/week)" },
      { value: "1.55", label: "Moderate (3-5 days/week)" },
      { value: "1.725", label: "Active (6-7 days/week)" },
      { value: "1.9", label: "Very Active (athlete)" }
    ]}
  ],
  run: ({ weight, height, age, gender, activity }) => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age), mult = parseFloat(activity) || 1.55;
    if (!w || !h || !a) throw new Error("Weight, height, and age required");
    const bmr = gender === "female" ? 10*w + 6.25*h - 5*a - 161 : 10*w + 6.25*h - 5*a + 5;
    const tdee = bmr * mult;
    return {
      bmr: bmr.toFixed(0) + " kcal",
      tdee: tdee.toFixed(0) + " kcal/day",
      weekly_calories: (tdee * 7).toFixed(0) + " kcal",
      to_lose_0_5kg: (tdee - 500).toFixed(0) + " kcal/day",
      to_lose_1kg: (tdee - 1000).toFixed(0) + " kcal/day",
      to_gain_0_5kg: (tdee + 500).toFixed(0) + " kcal/day",
      protein_target: (w * 1.8).toFixed(0) + " g/day",
      water_target: (w * 0.033).toFixed(1) + " L/day"
    };
  }
};