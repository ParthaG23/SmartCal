export default {
  name: "Factorial Calculator",
  slug: "factorial",
  category: "Math",
  description: "Exact big-integer factorial with permutations, combinations and Stirling approximation",

  fields: [
    { name: "n", label: "Number (n)", type: "number", placeholder: "10", hint: "Exact for n ≤ 170 · Stirling approximation above" },
    { name: "r", label: "r (for nPr / nCr) — optional", type: "number", placeholder: "3" },
  ],

  run: ({ n, r }) => {
    const N = parseInt(n, 10);
    const R = r !== undefined && r !== "" ? parseInt(r, 10) : null;

    if (isNaN(N) || N < 0) throw new Error("n must be a non-negative integer");
    if (N > 10000)          throw new Error("n too large (max 10000)");

    const factExact = (num) => {
      if (num <= 1) return 1n;
      let f = 1n;
      for (let i = 2n; i <= BigInt(num); i++) f *= i;
      return f;
    };

    const nFact     = factExact(N);
    const nFactStr  = nFact.toString();
    const digits    = nFactStr.length;
    const display   = digits > 30
      ? `${nFactStr.slice(0,15)}…(${digits} digits)`
      : nFactStr;

    const stirling = N > 1
      ? Math.sqrt(2 * Math.PI * N) * Math.pow(N / Math.E, N)
      : 1;

    let zeros = 0, temp = N;
    while (temp >= 5) { temp = Math.floor(temp/5); zeros += temp; }

    let nPr = null, nCr = null;
    if (R !== null && !isNaN(R) && R >= 0 && R <= N) {
      const rFact    = factExact(R);
      const nMinusR  = factExact(N - R);
      nPr = (nFact / nMinusR).toString();
      nCr = (nFact / (rFact * nMinusR)).toString();
      if (nPr.length > 25)  nPr = `${nPr.slice(0,12)}…(${nPr.length} digits)`;
      if (nCr.length > 25)  nCr = `${nCr.slice(0,12)}…(${nCr.length} digits)`;
    }

    const series = Array.from({ length: Math.min(N, 20) }, (_, i) => {
      const val = factExact(i+1);
      return { n: i+1, value: Number(val), logValue: parseFloat(Math.log10(Number(val)).toFixed(3)) };
    });

    const digitSeries = Array.from({ length: Math.min(N, 50) }, (_, i) => ({
      n: i+1, digits: factExact(i+1).toString().length,
    }));

    return {
      factorial:          display,
      digits_in_result:   digits,
      trailing_zeros:     zeros,
      stirling_approx:    N > 170 ? stirling.toExponential(6) : "Exact value used",
      npm_r:              R !== null ? `${N}P${R} = ${nPr}` : "N/A (no r given)",
      ncr:                R !== null ? `${N}C${R} = ${nCr}` : "N/A (no r given)",
      growth_series:      series,
      digit_series:       digitSeries,
    };
  },
};
