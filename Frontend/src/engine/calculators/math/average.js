export default {
  name: "Average Calculator",
  slug: "average",
  category: "Math",
  description: "Mean, median, mode, geometric mean, harmonic mean, variance and standard deviation",

  fields: [
    {
      name: "numbers",
      label: "Numbers (comma or space separated)",
      type: "text",
      placeholder: "10, 20, 30, 40, 50",
    },
    {
      name: "weights",
      label: "Weights for Weighted Mean (optional)",
      type: "text",
      placeholder: "1, 2, 3, 4, 5",
      hint: "Leave blank for equal weights",
    },
  ],

  run: ({ numbers, weights = "" }) => {
    const arr = String(numbers)
      .split(/[\s,;]+/)
      .map(Number)
      .filter(n => !isNaN(n));

    if (arr.length < 1) throw new Error("At least one number required");

    const n    = arr.length;
    const sum  = arr.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const sorted = [...arr].sort((a, b) => a - b);
    const mid    = Math.floor(n / 2);
    const median = n % 2 === 0 ? (sorted[mid-1] + sorted[mid]) / 2 : sorted[mid];

    const freq  = {};
    arr.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxF  = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxF).map(Number);
    const modeStr = maxF === 1 ? "No mode (all unique)" : modes.join(", ");

    const allPositive = arr.every(v => v > 0);
    const geoMean = allPositive
      ? Math.exp(arr.reduce((s, v) => s + Math.log(v), 0) / n)
      : null;

    const harmMean = allPositive
      ? n / arr.reduce((s, v) => s + 1/v, 0)
      : null;

    const variance   = arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const stdDev     = Math.sqrt(variance);
    const sampleVar  = n > 1 ? arr.reduce((s, v) => s + Math.pow(v-mean,2),0)/(n-1) : 0;
    const sampleStd  = Math.sqrt(sampleVar);
    const cv         = mean !== 0 ? (stdDev / mean) * 100 : 0;

    let weightedMean = null;
    if (weights.trim()) {
      const wArr = String(weights).split(/[\s,;]+/).map(Number).filter(n=>!isNaN(n));
      if (wArr.length === n) {
        const wSum = wArr.reduce((a,b)=>a+b,0);
        weightedMean = arr.reduce((s,v,i)=>s+v*wArr[i],0) / wSum;
      }
    }

    const range  = sorted[n-1] - sorted[0];
    const q1     = sorted[Math.floor(n/4)];
    const q3     = sorted[Math.floor(3*n/4)];
    const iqr    = q3 - q1;

    const distribution = arr.map((v, i) => ({
      index:     i + 1,
      value:     v,
      deviation: parseFloat((v - mean).toFixed(4)),
    }));

    return {
      count:              n,
      sum:                sum.toFixed(4),
      mean:               mean.toFixed(4),
      median:             median.toFixed(4),
      mode:               modeStr,
      geometric_mean:     geoMean   ? geoMean.toFixed(4)   : "N/A (negative values)",
      harmonic_mean:      harmMean  ? harmMean.toFixed(4)  : "N/A (negative values)",
      weighted_mean:      weightedMean ? weightedMean.toFixed(4) : "N/A",
      variance:           variance.toFixed(4),
      std_deviation:      stdDev.toFixed(4),
      sample_std_dev:     sampleStd.toFixed(4),
      coeff_of_variation: `${cv.toFixed(2)}%`,
      min:                sorted[0],
      max:                sorted[n-1],
      range,
      q1,
      q3,
      iqr,
      distribution,
    };
  },
};
