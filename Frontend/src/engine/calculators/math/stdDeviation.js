export default {
  name: "Standard Deviation Calculator", slug: "std-deviation", category: "Math",
  description: "Computes mean, variance, and standard deviation for population and sample data",
  fields: [
    { name: "numbers", label: "Numbers (comma-separated)", type: "text", placeholder: "10, 20, 30, 40, 50" }
  ],
  run: ({ numbers }) => {
    if (!numbers) throw new Error("Please enter comma-separated numbers");
    const arr = String(numbers).split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (arr.length < 2) throw new Error("At least 2 numbers required");
    const n = arr.length, sum = arr.reduce((a,b) => a+b, 0), mean = sum / n;
    const sorted = [...arr].sort((a,b) => a-b);
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const popVar = arr.reduce((s,x) => s + (x-mean)**2, 0) / n;
    const samVar = arr.reduce((s,x) => s + (x-mean)**2, 0) / (n-1);
    const popSD = Math.sqrt(popVar), samSD = Math.sqrt(samVar);
    const range = sorted[n-1] - sorted[0];
    return {
      count: n.toString(),
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      range: range.toFixed(4),
      population_variance: popVar.toFixed(4),
      population_std_dev: popSD.toFixed(4),
      sample_variance: samVar.toFixed(4),
      sample_std_dev: samSD.toFixed(4),
      coefficient_of_variation: ((popSD / mean) * 100).toFixed(2) + "%"
    };
  }
};