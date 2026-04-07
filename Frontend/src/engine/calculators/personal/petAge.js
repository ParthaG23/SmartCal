export default {
  name: "Pet Age Converter", slug: "pet-age", category: "Personal",
  description: "Converts dog and cat ages into equivalent human years using modern formulas",
  fields: [
    { name: "petAge", label: "Pet's Age (years)", type: "number", placeholder: "5" },
    { name: "petType", label: "Pet Type", type: "select", options: [
      { value: "dog", label: "Dog" }, { value: "cat", label: "Cat" }
    ]},
    { name: "size", label: "Breed Size (dogs only)", type: "select", options: [
      { value: "small", label: "Small (< 10 kg)" }, { value: "medium", label: "Medium (10-25 kg)" },
      { value: "large", label: "Large (> 25 kg)" }
    ]}
  ],
  run: ({ petAge, petType, size = "medium" }) => {
    const age = parseFloat(petAge);
    if (!age || age < 0) throw new Error("Valid pet age required");
    let humanYears;
    if (petType === "cat") {
      humanYears = age <= 1 ? 15 : age <= 2 ? 24 : 24 + (age - 2) * 4;
    } else {
      const rates = { small: 4, medium: 5, large: 6 };
      const r = rates[size] || 5;
      humanYears = age <= 1 ? 15 : age <= 2 ? 24 : 24 + (age - 2) * r;
    }
    const avgLifespan = petType === "cat" ? 15 : size === "small" ? 14 : size === "large" ? 10 : 12;
    const lifeStage = humanYears < 15 ? "Puppy/Kitten" : humanYears < 30 ? "Young Adult" : humanYears < 55 ? "Adult" : humanYears < 75 ? "Senior" : "Geriatric";
    return {
      human_years: Math.round(humanYears) + " years",
      life_stage: lifeStage,
      avg_lifespan: avgLifespan + " years",
      remaining_estimate: Math.max(0, avgLifespan - age).toFixed(1) + " years",
      pet_type: petType === "cat" ? "🐱 Cat" : "🐶 Dog",
      next_birthday_human: Math.round(humanYears + (petType === "cat" ? 4 : (rates => rates[size] || 5)({small:4,medium:5,large:6}))) + " human years"
    };
  }
};