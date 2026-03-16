module.exports = {
  name: "BMI Calculator",
  slug: "bmi",
  category: "Health",
  description: "Body Mass Index with ideal weight range, body fat estimate and health risk",

  fields: [
    {
      name: "weight",
      label: "Weight",
      type: "number",
      placeholder: "70",
      units: ["kg", "lb", "oz"],      // front-end shows unit selector
      defaultUnit: "kg",
    },
    {
      name: "height",
      label: "Height",
      type: "number",
      placeholder: "175",
      units: ["cm", "m", "ft", "in"],
      defaultUnit: "cm",
    },
    {
      name: "age",
      label: "Age (years)",
      type: "number",
      placeholder: "25",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "male",   label: "Male"   },
        { value: "female", label: "Female" },
      ],
    },
  ],

  // Front-end must convert to kg / cm before calling run()
  run: ({ weight, height, age, gender, weightUnit = "kg", heightUnit = "cm" }) => {
    // ── Unit normalisation (fallback if front-end didn't convert) ──
    let w = parseFloat(weight);
    let h = parseFloat(height);
    const a = parseFloat(age) || 25;

    if (weightUnit === "lb")  w *= 0.453592;
    if (weightUnit === "oz")  w *= 0.0283495;
    if (heightUnit === "m")   h *= 100;
    if (heightUnit === "ft")  h *= 30.48;
    if (heightUnit === "in")  h *= 2.54;

    if (!w || !h || w <= 0 || h <= 0) throw new Error("Valid weight and height required");

    const hm  = h / 100;
    const bmi = w / (hm * hm);

    // ── Category ──
    const category =
      bmi < 16   ? "Severe Underweight" :
      bmi < 17   ? "Moderate Underweight" :
      bmi < 18.5 ? "Mild Underweight" :
      bmi < 25   ? "Normal Weight" :
      bmi < 27.5 ? "Pre-Obese" :
      bmi < 30   ? "Overweight" :
      bmi < 35   ? "Obese Class I" :
      bmi < 40   ? "Obese Class II" :
                   "Obese Class III";

    const healthRisk =
      bmi < 18.5 ? "Low (risk of other clinical problems)" :
      bmi < 25   ? "Average" :
      bmi < 30   ? "Increased" :
      bmi < 35   ? "High" :
                   "Very High";

    // ── Ideal weight (Devine formula) ──
    const heightInches = h / 2.54;
    const idealKg = gender === "female"
      ? 45.5 + 2.3 * (heightInches - 60)
      : 50   + 2.3 * (heightInches - 60);
    const idealMin = (18.5 * hm * hm).toFixed(1);
    const idealMax = (24.9 * hm * hm).toFixed(1);

    // ── Body fat estimate (Deurenberg formula) ──
    const g   = gender === "female" ? 0 : 1;
    const bfp = (1.20 * bmi) + (0.23 * a) - (10.8 * g) - 5.4;

    // ── Ponderal index ──
    const ponderal = (w / Math.pow(hm, 3)).toFixed(2);

    // ── BMR (Mifflin-St Jeor) ──
    const bmr = gender === "female"
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5;

    return {
      bmi:           bmi.toFixed(2),
      category,
      health_risk:   healthRisk,
      ideal_weight:  `${idealMin}–${idealMax} kg`,
      devine_ideal:  `${idealKg.toFixed(1)} kg`,
      body_fat_est:  `${bfp.toFixed(1)}%`,
      ponderal_index: ponderal,
      bmr:           `${Math.round(bmr)} kcal/day`,
    };
  },
};
