export default {
  name: "Ohm's Law Calculator", slug: "ohms-law", category: "Science",
  description: "Calculates Voltage, Current, Resistance, and Power in electrical circuits",
  fields: [
    { name: "voltage", label: "Voltage (V)", type: "number", placeholder: "12", hint: "Leave empty to calculate" },
    { name: "current", label: "Current (A)", type: "number", placeholder: "2", hint: "Leave empty to calculate" },
    { name: "resistance", label: "Resistance (Ω)", type: "number", placeholder: "", hint: "Leave empty to calculate" }
  ],
  run: ({ voltage, current, resistance }) => {
    let V = parseFloat(voltage), I = parseFloat(current), R = parseFloat(resistance);
    const has = [!isNaN(V), !isNaN(I), !isNaN(R)].filter(Boolean).length;
    if (has < 2) throw new Error("Provide at least 2 values");
    if (isNaN(V)) V = I * R;
    else if (isNaN(I)) I = V / R;
    else if (isNaN(R)) R = V / I;
    const P = V * I;
    return {
      voltage: V.toFixed(3) + " V",
      current: I.toFixed(3) + " A",
      resistance: R.toFixed(3) + " Ω",
      power: P.toFixed(3) + " W",
      power_kw: (P / 1000).toFixed(4) + " kW",
      current_ma: (I * 1000).toFixed(1) + " mA",
      energy_per_hour: (P * 3600).toFixed(0) + " J/hr"
    };
  }
};