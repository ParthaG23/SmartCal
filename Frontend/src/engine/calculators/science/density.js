export default {
  name: "Density Calculator", slug: "density", category: "Science",
  description: "Calculates density from mass and volume with material comparison",
  fields: [
    { name: "mass", label: "Mass (kg)", type: "number", placeholder: "5" },
    { name: "volume", label: "Volume (m³)", type: "number", placeholder: "0.005" }
  ],
  run: ({ mass, volume }) => {
    const m = parseFloat(mass), v = parseFloat(volume);
    if (!m || !v) throw new Error("Mass and volume required");
    const density = m / v;
    const floats = density < 1000 ? "Yes (less than water)" : "No (sinks in water)";
    const material = density < 700 ? "Like wood" : density < 1000 ? "Like ice/plastic" : density < 2700 ? "Like stone/glass" : density < 8000 ? "Like steel/iron" : "Like lead/gold";
    return {
      density: density.toFixed(2) + " kg/m³",
      density_gcm3: (density / 1000).toFixed(4) + " g/cm³",
      mass: m.toFixed(4) + " kg",
      volume: v.toFixed(6) + " m³",
      floats_in_water: floats,
      similar_to: material,
      specific_gravity: (density / 1000).toFixed(4)
    };
  }
};