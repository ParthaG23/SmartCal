export default {
  name: "Quadratic Equation Solver", slug: "quadratic", category: "Math",
  description: "Finds roots of ax² + bx + c = 0 with discriminant analysis and vertex",
  fields: [
    { name: "a", label: "Coefficient a (x²)", type: "number", placeholder: "1" },
    { name: "b", label: "Coefficient b (x)", type: "number", placeholder: "-5" },
    { name: "c", label: "Constant c", type: "number", placeholder: "6" }
  ],
  run: ({ a, b, c }) => {
    const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c);
    if (!A) throw new Error("Coefficient 'a' cannot be zero (use linear solver)");
    const disc = B*B - 4*A*C;
    const vertexX = -B / (2*A), vertexY = A*vertexX*vertexX + B*vertexX + C;
    let root1, root2, rootType;
    if (disc > 0) {
      root1 = (-B + Math.sqrt(disc)) / (2*A);
      root2 = (-B - Math.sqrt(disc)) / (2*A);
      rootType = "Two Real Roots";
    } else if (disc === 0) {
      root1 = root2 = -B / (2*A);
      rootType = "One Repeated Root";
    } else {
      const real = -B / (2*A), imag = Math.sqrt(-disc) / (2*A);
      root1 = real.toFixed(4) + " + " + imag.toFixed(4) + "i";
      root2 = real.toFixed(4) + " − " + imag.toFixed(4) + "i";
      rootType = "Complex Conjugate Roots";
    }
    return {
      root_1: typeof root1 === "number" ? root1.toFixed(4) : root1,
      root_2: typeof root2 === "number" ? root2.toFixed(4) : root2,
      discriminant: disc.toFixed(4),
      root_type: rootType,
      vertex: "(" + vertexX.toFixed(3) + ", " + vertexY.toFixed(3) + ")",
      axis_of_symmetry: "x = " + vertexX.toFixed(3),
      direction: A > 0 ? "Opens Upward ∪" : "Opens Downward ∩",
      equation: A + "x² + (" + B + ")x + (" + C + ") = 0"
    };
  }
};