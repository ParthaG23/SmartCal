export default {
  name: "Force & Acceleration", slug: "force-acceleration", category: "Science",
  description: "Uses Newton's Second Law (F = ma) to calculate force, mass, or acceleration",
  fields: [
    { name: "mass", label: "Mass (kg)", type: "number", placeholder: "50" },
    { name: "acceleration", label: "Acceleration (m/s²)", type: "number", placeholder: "9.81" }
  ],
  run: ({ mass, acceleration }) => {
    const m = parseFloat(mass), a = parseFloat(acceleration);
    if (!m || !a) throw new Error("Mass and acceleration required");
    const F = m * a;
    return {
      force: F.toFixed(2) + " N",
      force_kn: (F/1000).toFixed(4) + " kN",
      weight_kgf: (F / 9.81).toFixed(2) + " kgf",
      force_lbf: (F * 0.224809).toFixed(2) + " lbf",
      momentum_1s: (m * a * 1).toFixed(2) + " kg·m/s",
      pressure_1m2: F.toFixed(2) + " Pa",
      is_gravity: Math.abs(a - 9.81) < 0.1 ? "≈ Earth gravity" : a > 9.81 ? "Above gravity" : "Below gravity"
    };
  }
};