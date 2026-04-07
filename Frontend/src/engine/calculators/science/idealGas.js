export default {
  name: "Ideal Gas Law", slug: "ideal-gas", category: "Science",
  description: "Computes Pressure, Volume, Temperature, or Moles using PV = nRT",
  fields: [
    { name: "solveFor", label: "Solve For", type: "select", options: [
      { value: "P", label: "Pressure (atm)" }, { value: "V", label: "Volume (L)" },
      { value: "n", label: "Moles" }, { value: "T", label: "Temperature (K)" }
    ]},
    { name: "pressure", label: "Pressure (atm)", type: "number", placeholder: "1" },
    { name: "volume", label: "Volume (L)", type: "number", placeholder: "22.4" },
    { name: "moles", label: "Moles (n)", type: "number", placeholder: "1" },
    { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "273.15" }
  ],
  run: ({ solveFor, pressure, volume, moles, temperature }) => {
    const R = 0.08206;
    let P = parseFloat(pressure), V = parseFloat(volume), n = parseFloat(moles), T = parseFloat(temperature);
    if (solveFor === "P") { P = (n * R * T) / V; }
    else if (solveFor === "V") { V = (n * R * T) / P; }
    else if (solveFor === "n") { n = (P * V) / (R * T); }
    else { T = (P * V) / (n * R); }
    if (!isFinite(P) || !isFinite(V) || !isFinite(n) || !isFinite(T)) throw new Error("Invalid input combination");
    return {
      pressure: P.toFixed(4) + " atm",
      pressure_kpa: (P * 101.325).toFixed(2) + " kPa",
      volume: V.toFixed(4) + " L",
      moles: n.toFixed(4) + " mol",
      temperature_K: T.toFixed(2) + " K",
      temperature_C: (T - 273.15).toFixed(2) + " °C",
      gas_constant: R + " L·atm/(mol·K)"
    };
  }
};