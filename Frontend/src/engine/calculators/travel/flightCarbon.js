export default {
  name: "Flight Carbon Footprint", slug: "flight-carbon", category: "Travel",
  description: "Calculates CO₂ emissions from flights based on distance and class",
  fields: [
    { name: "distance", label: "Flight Distance (km)", type: "number", placeholder: "2000" },
    { name: "passengers", label: "Number of Passengers", type: "number", placeholder: "1" },
    { name: "flightClass", label: "Flight Class", type: "select", options: [
      { value: "economy", label: "Economy" }, { value: "business", label: "Business" }, { value: "first", label: "First Class" }
    ]}
  ],
  run: ({ distance, passengers = 1, flightClass = "economy" }) => {
    const d = parseFloat(distance), p = parseInt(passengers) || 1;
    if (!d) throw new Error("Flight distance required");
    const classMult = { economy: 1, business: 2.9, first: 4 };
    const mult = classMult[flightClass] || 1;
    const co2Kg = d * 0.115 * mult * p;
    const treesToOffset = co2Kg / 22;
    return {
      co2_emissions: co2Kg.toFixed(1) + " kg CO₂",
      co2_tons: (co2Kg / 1000).toFixed(3) + " tonnes",
      per_passenger: (co2Kg / p).toFixed(1) + " kg CO₂",
      trees_to_offset: Math.ceil(treesToOffset) + " trees/year",
      equivalent_car_km: (co2Kg / 0.21).toFixed(0) + " km by car",
      offset_cost_estimate: (co2Kg * 0.5).toFixed(0) + " (₹0.50/kg)",
      class_multiplier: mult + "x (" + flightClass + ")"
    };
  }
};