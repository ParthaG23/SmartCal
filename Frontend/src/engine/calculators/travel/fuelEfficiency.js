export default {
  name: "Fuel Efficiency Converter", slug: "fuel-efficiency", category: "Travel",
  description: "Converts between MPG, km/L, and L/100km fuel efficiency units",
  fields: [
    { name: "value", label: "Efficiency Value", type: "number", placeholder: "15" },
    { name: "fromUnit", label: "From Unit", type: "select", options: [
      { value: "kmpl", label: "km/L (KMPL)" }, { value: "mpg", label: "Miles per Gallon (MPG)" }, { value: "l100km", label: "L/100km" }
    ]}
  ],
  run: ({ value, fromUnit }) => {
    const v = parseFloat(value);
    if (!v) throw new Error("Efficiency value required");
    let kmpl, mpg, l100km;
    if (fromUnit === "kmpl") { kmpl = v; mpg = v * 2.352; l100km = 100 / v; }
    else if (fromUnit === "mpg") { mpg = v; kmpl = v / 2.352; l100km = 235.215 / v; }
    else { l100km = v; kmpl = 100 / v; mpg = 235.215 / v; }
    const rating = kmpl > 20 ? "Excellent 🌟" : kmpl > 15 ? "Good ✅" : kmpl > 10 ? "Average" : "Poor 🔴";
    return {
      km_per_litre: kmpl.toFixed(2) + " km/L",
      miles_per_gallon: mpg.toFixed(2) + " MPG",
      litres_per_100km: l100km.toFixed(2) + " L/100km",
      efficiency_rating: rating,
      cost_per_100km: (l100km * 100).toFixed(0) + " ml fuel",
      annual_fuel_15k: ((15000 / kmpl) * 100).toFixed(0) + " litres (15K km/yr)"
    };
  }
};