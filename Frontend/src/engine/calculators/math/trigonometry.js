export default {
  name: "Trigonometry Calculator", slug: "trigonometry", category: "Math",
  description: "Computes all six trigonometric functions in degrees or radians",
  fields: [
    { name: "angle", label: "Angle", type: "number", placeholder: "45" },
    { name: "angleUnit", label: "Angle Unit", type: "select", options: [
      { value: "degrees", label: "Degrees" }, { value: "radians", label: "Radians" }
    ]}
  ],
  run: ({ angle, angleUnit = "degrees" }) => {
    const a = parseFloat(angle);
    if (a === undefined || isNaN(a)) throw new Error("Angle is required");
    const rad = angleUnit === "degrees" ? a * Math.PI / 180 : a;
    const deg = angleUnit === "degrees" ? a : a * 180 / Math.PI;
    const sin = Math.sin(rad), cos = Math.cos(rad), tan = Math.abs(cos) < 1e-10 ? Infinity : Math.tan(rad);
    return {
      sine: sin.toFixed(6),
      cosine: cos.toFixed(6),
      tangent: isFinite(tan) ? tan.toFixed(6) : "Undefined",
      cosecant: Math.abs(sin) < 1e-10 ? "Undefined" : (1/sin).toFixed(6),
      secant: Math.abs(cos) < 1e-10 ? "Undefined" : (1/cos).toFixed(6),
      cotangent: Math.abs(sin) < 1e-10 ? "Undefined" : (cos/sin).toFixed(6),
      in_degrees: deg.toFixed(4) + "°",
      in_radians: rad.toFixed(6) + " rad"
    };
  }
};