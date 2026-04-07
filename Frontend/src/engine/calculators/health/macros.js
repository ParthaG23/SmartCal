export default {
  name: "Macro Calculator", slug: "macros", category: "Health",
  description: "Calculates daily protein, carbohydrate, and fat targets based on your fitness goals",
  fields: [
    { name: "weight", label: "Weight (kg)", type: "number", placeholder: "70" },
    { name: "height", label: "Height (cm)", type: "number", placeholder: "175" },
    { name: "age", label: "Age", type: "number", placeholder: "25" },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }
    ]},
    { name: "activity", label: "Activity Level", type: "select", options: [
      { value: "1.2", label: "Sedentary" }, { value: "1.375", label: "Light Active" },
      { value: "1.55", label: "Moderate" }, { value: "1.725", label: "Very Active" }
    ]},
    { name: "goal", label: "Goal", type: "select", options: [
      { value: "lose", label: "Fat Loss" }, { value: "maintain", label: "Maintain" }, { value: "gain", label: "Muscle Gain" }
    ]}
  ],
  run: ({ weight, height, age, gender, activity, goal }) => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age), mult = parseFloat(activity) || 1.55;
    if (!w || !h || !a) throw new Error("Required fields missing");
    const bmr = gender === "female" ? 10*w + 6.25*h - 5*a - 161 : 10*w + 6.25*h - 5*a + 5;
    const tdee = bmr * mult;
    const adj = goal === "lose" ? -500 : goal === "gain" ? 400 : 0;
    const cal = tdee + adj;
    const proteinG = goal === "gain" ? w * 2.2 : w * 1.8;
    const fatG = (cal * 0.25) / 9;
    const carbG = (cal - proteinG * 4 - fatG * 9) / 4;
    return {
      target_calories: cal.toFixed(0) + " kcal",
      protein: proteinG.toFixed(0) + " g (" + (proteinG * 4).toFixed(0) + " kcal)",
      carbohydrates: carbG.toFixed(0) + " g (" + (carbG * 4).toFixed(0) + " kcal)",
      fats: fatG.toFixed(0) + " g (" + (fatG * 9).toFixed(0) + " kcal)",
      protein_pct: ((proteinG * 4 / cal) * 100).toFixed(0) + "%",
      carbs_pct: ((carbG * 4 / cal) * 100).toFixed(0) + "%",
      fats_pct: ((fatG * 9 / cal) * 100).toFixed(0) + "%",
      meals_3x: "~" + (cal / 3).toFixed(0) + " kcal each"
    };
  }
};