export default {
  name: "Kinetic Energy Calculator", slug: "kinetic-energy", category: "Science",
  description: "Calculates kinetic energy, momentum, and equivalent potential energy height",
  fields: [
    { name: "mass", label: "Mass (kg)", type: "number", placeholder: "10" },
    { name: "velocity", label: "Velocity (m/s)", type: "number", placeholder: "20" }
  ],
  run: ({ mass, velocity }) => {
    const m = parseFloat(mass), v = parseFloat(velocity);
    if (!m || v === undefined) throw new Error("Mass and velocity required");
    const ke = 0.5 * m * v * v;
    const momentum = m * v;
    const eqHeight = ke / (m * 9.81);
    return {
      kinetic_energy: ke.toFixed(2) + " J",
      energy_kj: (ke / 1000).toFixed(4) + " kJ",
      momentum: momentum.toFixed(2) + " kg·m/s",
      equivalent_height: eqHeight.toFixed(2) + " m",
      velocity_kmh: (v * 3.6).toFixed(2) + " km/h",
      energy_calories: (ke / 4.184).toFixed(2) + " cal",
      stopping_force_1m: ke.toFixed(2) + " N"
    };
  }
};