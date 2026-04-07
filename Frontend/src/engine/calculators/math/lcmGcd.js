export default {
  name: "LCM & GCD Calculator", slug: "lcm-gcd", category: "Math",
  description: "Finds the Least Common Multiple and Greatest Common Divisor using Euclidean algorithm",
  fields: [
    { name: "number1", label: "Number 1", type: "number", placeholder: "12" },
    { name: "number2", label: "Number 2", type: "number", placeholder: "18" }
  ],
  run: ({ number1, number2 }) => {
    const a = parseInt(number1), b = parseInt(number2);
    if (!a || !b) throw new Error("Two positive numbers required");
    const gcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while(y) { [x,y] = [y, x%y]; } return x; };
    const g = gcd(a, b), l = Math.abs(a * b) / g;
    const coprime = g === 1;
    return {
      gcd: g.toString(),
      lcm: l.toString(),
      relationship: a + " × " + b + " = GCD × LCM = " + (g * l),
      coprime: coprime ? "Yes (GCD = 1)" : "No",
      gcd_as_linear: g + " = " + a + "k + " + b + "m (Bézout)",
      product_check: (a * b === g * l) ? "Verified ✓" : "Error"
    };
  }
};