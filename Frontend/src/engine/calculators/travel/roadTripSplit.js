export default {
  name: "Road Trip Budget Splitter", slug: "road-trip-split", category: "Travel",
  description: "Splits all road trip expenses proportionally among travelers",
  fields: [
    { name: "fuelCost", label: "Total Fuel Cost (₹)", type: "number", placeholder: "5000" },
    { name: "tollCost", label: "Tolls (₹)", type: "number", placeholder: "800" },
    { name: "foodCost", label: "Food & Drinks (₹)", type: "number", placeholder: "3000" },
    { name: "otherCosts", label: "Other Costs (₹)", type: "number", placeholder: "1000" },
    { name: "numberOfPeople", label: "Number of People", type: "number", placeholder: "4" }
  ],
  run: ({ fuelCost = 0, tollCost = 0, foodCost = 0, otherCosts = 0, numberOfPeople }) => {
    const fuel = parseFloat(fuelCost)||0, toll = parseFloat(tollCost)||0, food = parseFloat(foodCost)||0, other = parseFloat(otherCosts)||0;
    const people = parseInt(numberOfPeople) || 1;
    const total = fuel + toll + food + other, perPerson = total / people;
    return {
      total_trip_cost: total.toFixed(0),
      cost_per_person: perPerson.toFixed(0),
      fuel_share: (fuel / people).toFixed(0) + " each",
      toll_share: (toll / people).toFixed(0) + " each",
      food_share: (food / people).toFixed(0) + " each",
      other_share: (other / people).toFixed(0) + " each",
      traveler_count: people + " people"
    };
  }
};