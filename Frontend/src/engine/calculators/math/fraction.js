export default {
  name: "Fraction Calculator", slug: "fraction", category: "Math",
  description: "Performs addition, subtraction, multiplication, and division of fractions with simplification",
  fields: [
    { name: "num1", label: "Numerator 1", type: "number", placeholder: "3" },
    { name: "den1", label: "Denominator 1", type: "number", placeholder: "4" },
    { name: "operation", label: "Operation", type: "select", options: [
      { value: "add", label: "Add (+)" }, { value: "sub", label: "Subtract (−)" },
      { value: "mul", label: "Multiply (×)" }, { value: "div", label: "Divide (÷)" }
    ]},
    { name: "num2", label: "Numerator 2", type: "number", placeholder: "1" },
    { name: "den2", label: "Denominator 2", type: "number", placeholder: "2" }
  ],
  run: ({ num1, den1, operation, num2, den2 }) => {
    let a = parseInt(num1), b = parseInt(den1), c = parseInt(num2), d = parseInt(den2);
    if (!b || !d) throw new Error("Denominators cannot be zero");
    const gcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while(y) { [x,y] = [y, x%y]; } return x; };
    let rn, rd;
    if (operation === "add") { rn = a*d + c*b; rd = b*d; }
    else if (operation === "sub") { rn = a*d - c*b; rd = b*d; }
    else if (operation === "mul") { rn = a*c; rd = b*d; }
    else { rn = a*d; rd = b*c; }
    if (rd === 0) throw new Error("Division by zero");
    const g = gcd(rn, rd);
    const sn = rn/g, sd = rd/g;
    const decimal = sn / sd;
    const whole = Math.floor(Math.abs(decimal));
    return {
      result_fraction: sn + "/" + sd,
      decimal_value: decimal.toFixed(6),
      mixed_number: Math.abs(decimal) >= 1 ? (decimal < 0 ? "-" : "") + whole + " " + Math.abs(sn % sd) + "/" + Math.abs(sd) : sn + "/" + sd,
      original_expression: a + "/" + b + " " + {add:"+",sub:"−",mul:"×",div:"÷"}[operation] + " " + c + "/" + d,
      gcd_of_result: g.toString(),
      is_proper: Math.abs(sn) < Math.abs(sd) ? "Yes ✓" : "No (improper)"
    };
  }
};