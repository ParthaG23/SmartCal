export default {
  name: "Body Fat Percentage", slug: "body-fat", category: "Health",
  description: "Estimates body fat using the U.S. Navy circumference method",
  fields: [
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }
    ]},
    { name: "height", label: "Height (cm)", type: "number", placeholder: "175" },
    { name: "waist", label: "Waist (cm)", type: "number", placeholder: "85" },
    { name: "neck", label: "Neck (cm)", type: "number", placeholder: "38" },
    { name: "hip", label: "Hip (cm, females only)", type: "number", placeholder: "95" },
    { name: "weight", label: "Weight (kg)", type: "number", placeholder: "70" }
  ],
  run: ({ gender, height, waist, neck, hip = 0, weight }) => {
    const h = parseFloat(height), wa = parseFloat(waist), n = parseFloat(neck), hi = parseFloat(hip) || 0, w = parseFloat(weight);
    if (!h || !wa || !n) throw new Error("Height, waist, and neck measurements required");
    let bf;
    if (gender === "female") {
      if (!hi) throw new Error("Hip measurement is required for females");
      bf = 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.22100 * Math.log10(h)) - 450;
    } else {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    }
    bf = Math.max(2, Math.min(60, bf));
    const fatMass = w ? (w * bf / 100) : 0, leanMass = w ? w - fatMass : 0;
    const cat = gender === "male"
      ? (bf < 6 ? "Essential" : bf < 14 ? "Athletic" : bf < 18 ? "Fitness" : bf < 25 ? "Average" : "Obese")
      : (bf < 14 ? "Essential" : bf < 21 ? "Athletic" : bf < 25 ? "Fitness" : bf < 32 ? "Average" : "Obese");
    return {
      body_fat: bf.toFixed(1) + "%",
      category: cat,
      fat_mass: fatMass.toFixed(1) + " kg",
      lean_mass: leanMass.toFixed(1) + " kg",
      fat_to_lean_ratio: (fatMass / (leanMass || 1)).toFixed(3),
      ideal_bf: gender === "male" ? "10-20%" : "18-28%"
    };
  }
};