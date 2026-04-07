export default {
  name: "Ideal Body Weight", slug: "ideal-weight", category: "Health",
  description: "Calculates ideal weight using Devine, Robinson, Miller, and Hamwi formulas",
  fields: [
    { name: "height", label: "Height (cm)", type: "number", placeholder: "170" },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "male", label: "Male" }, { value: "female", label: "Female" }
    ]}
  ],
  run: ({ height, gender }) => {
    const h = parseFloat(height);
    if (!h) throw new Error("Height is required");
    const inches = h / 2.54, over60 = Math.max(0, inches - 60);
    let devine, robinson, miller, hamwi;
    if (gender === "female") {
      devine = 45.5 + 2.3 * over60;
      robinson = 49 + 1.7 * over60;
      miller = 53.1 + 1.36 * over60;
      hamwi = 45.5 + 2.2 * over60;
    } else {
      devine = 50 + 2.3 * over60;
      robinson = 52 + 1.9 * over60;
      miller = 56.2 + 1.41 * over60;
      hamwi = 48 + 2.7 * over60;
    }
    const avg = (devine + robinson + miller + hamwi) / 4;
    const bmiMin = 18.5 * (h/100) * (h/100), bmiMax = 24.9 * (h/100) * (h/100);
    return {
      devine_formula: devine.toFixed(1) + " kg",
      robinson_formula: robinson.toFixed(1) + " kg",
      miller_formula: miller.toFixed(1) + " kg",
      hamwi_formula: hamwi.toFixed(1) + " kg",
      average_ideal: avg.toFixed(1) + " kg",
      healthy_bmi_range: bmiMin.toFixed(1) + " – " + bmiMax.toFixed(1) + " kg",
      recommended: avg.toFixed(1) + " ± 5 kg"
    };
  }
};