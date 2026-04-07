export default {
  name: "Gravitational Force", slug: "gravitational-force", category: "Science",
  description: "Calculates gravitational attraction between two masses using Newton's law",
  fields: [
    { name: "mass1", label: "Mass 1 (kg)", type: "number", placeholder: "5.972e24", hint: "Earth ≈ 5.972×10²⁴ kg" },
    { name: "mass2", label: "Mass 2 (kg)", type: "number", placeholder: "70" },
    { name: "distance", label: "Distance (m)", type: "number", placeholder: "6371000", hint: "Earth radius ≈ 6,371,000 m" }
  ],
  run: ({ mass1, mass2, distance }) => {
    const G = 6.674e-11;
    const m1 = parseFloat(mass1), m2 = parseFloat(mass2), r = parseFloat(distance);
    if (!m1 || !m2 || !r) throw new Error("All three values required");
    const F = G * m1 * m2 / (r * r);
    const a1 = F / m1, a2 = F / m2;
    return {
      gravitational_force: F.toExponential(4) + " N",
      acceleration_m1: a1.toExponential(4) + " m/s²",
      acceleration_m2: a2.toExponential(4) + " m/s²",
      force_comparison: (F / (m2 * 9.81)).toFixed(4) + "× Earth weight",
      orbital_velocity: Math.sqrt(G * m1 / r).toFixed(2) + " m/s",
      escape_velocity: (Math.sqrt(2 * G * m1 / r)).toFixed(2) + " m/s",
      gravitational_constant: G.toExponential(4) + " N·m²/kg²"
    };
  }
};