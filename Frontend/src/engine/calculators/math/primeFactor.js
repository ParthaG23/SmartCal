export default {
  name: "Prime Factorization", slug: "prime-factor", category: "Math",
  description: "Determines if a number is prime and breaks it into prime factors",
  fields: [
    { name: "number", label: "Number", type: "number", placeholder: "360" }
  ],
  run: ({ number }) => {
    let n = parseInt(number);
    if (!n || n < 2) throw new Error("Enter an integer >= 2");
    const original = n, factors = [];
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) { factors.push(d); n /= d; }
      d++;
    }
    if (n > 1) factors.push(n);
    const unique = [...new Set(factors)];
    const isPrime = factors.length === 1 && factors[0] === original;
    // Count total divisors
    const countMap = {};
    factors.forEach(f => countMap[f] = (countMap[f]||0) + 1);
    let totalDivisors = 1;
    Object.values(countMap).forEach(exp => totalDivisors *= (exp + 1));
    const factorString = Object.entries(countMap).map(([p,e]) => e > 1 ? p + "^" + e : p).join(" × ");
    return {
      number: original.toString(),
      is_prime: isPrime ? "Yes ✓" : "No",
      prime_factors: factorString,
      unique_primes: unique.join(", "),
      total_prime_factors: factors.length.toString(),
      total_divisors: totalDivisors.toString(),
      smallest_factor: factors[0].toString(),
      largest_factor: factors[factors.length - 1].toString()
    };
  }
};