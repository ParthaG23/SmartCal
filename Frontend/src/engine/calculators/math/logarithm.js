export default {
  name: "Logarithm Calculator", slug: "logarithm", category: "Math",
  description: "Calculates logarithms for any base, including natural log and common log",
  fields: [
    { name: "number", label: "Number", type: "number", placeholder: "100" },
    { name: "base", label: "Base (leave empty for base 10)", type: "number", placeholder: "10" }
  ],
  run: ({ number, base }) => {
    const n = parseFloat(number), b = parseFloat(base) || 10;
    if (!n || n <= 0) throw new Error("Number must be positive");
    if (b <= 0 || b === 1) throw new Error("Base must be positive and not 1");
    const logBase = Math.log(n) / Math.log(b);
    const ln = Math.log(n), log10 = Math.log10(n), log2 = Math.log2(n);
    return {
      log_result: logBase.toFixed(6),
      natural_log: ln.toFixed(6),
      common_log: log10.toFixed(6),
      binary_log: log2.toFixed(6),
      antilog: Math.pow(b, logBase).toFixed(4),
      base_used: b.toString(),
      identity_check: b + "^" + logBase.toFixed(4) + " = " + n
    };
  }
};