module.exports = {
  name: "Temperature Converter",
  slug: "temperature",
  category: "Science",
  description: "Convert between Celsius, Fahrenheit, Kelvin, Rankine and Réaumur with context",

  fields: [
    {
      name: "value",
      label: "Temperature Value",
      type: "number",
      placeholder: "100",
    },
    {
      name: "fromUnit",
      label: "From",
      type: "select",
      options: [
        { value: "celsius",    label: "Celsius (°C)"    },
        { value: "fahrenheit", label: "Fahrenheit (°F)" },
        { value: "kelvin",     label: "Kelvin (K)"      },
        { value: "rankine",    label: "Rankine (°R)"    },
        { value: "reaumur",    label: "Réaumur (°Ré)"   },
      ],
    },
  ],

  run: ({ value, fromUnit = "celsius" }) => {
    const v = parseFloat(value);
    if (isNaN(v)) throw new Error("Temperature value is required");

    // ── Convert everything to Celsius first ──
    let c;
    switch (fromUnit) {
      case "celsius":    c = v;                       break;
      case "fahrenheit": c = (v - 32) * 5 / 9;       break;
      case "kelvin":     c = v - 273.15;              break;
      case "rankine":    c = (v - 491.67) * 5 / 9;   break;
      case "reaumur":    c = v * 5 / 4;               break;
      default:           throw new Error("Unknown unit");
    }

    if (c < -273.15) throw new Error("Temperature below absolute zero is not possible");

    const f  = c * 9 / 5 + 32;
    const k  = c + 273.15;
    const ra = (c + 273.15) * 9 / 5;
    const re = c * 4 / 5;

    // ── Context ──
    const context =
      c <= -273.15 ? "Absolute zero — no thermal energy"    :
      c < -89      ? "Coldest recorded on Earth"            :
      c < -40      ? "Extreme polar cold"                   :
      c < 0        ? "Below freezing"                       :
      c === 0      ? "Water freezing point"                 :
      c < 20       ? "Cold / room temperature"              :
      c < 37       ? "Comfortable room / body temperature"  :
      c === 37     ? "Normal human body temperature"        :
      c < 56       ? "Fever / very hot day"                 :
      c < 100      ? "Above body temperature, hot liquids"  :
      c === 100    ? "Water boiling point (sea level)"      :
      c < 300      ? "Hot industrial processes"             :
      c < 1000     ? "Fire / combustion temperatures"       :
      c < 5500     ? "Metal melting range"                  :
                     "Extreme industrial / stellar temp";

    // ── Conversion table for chart ──
    const conversionTable = [-40, -20, 0, 20, 37, 60, 100, 200, 300].map(cv => ({
      celsius:    cv,
      fahrenheit: parseFloat((cv * 9/5 + 32).toFixed(2)),
      kelvin:     parseFloat((cv + 273.15).toFixed(2)),
    }));

    return {
      celsius:          `${c.toFixed(4)} °C`,
      fahrenheit:       `${f.toFixed(4)} °F`,
      kelvin:           `${k.toFixed(4)} K`,
      rankine:          `${ra.toFixed(4)} °R`,
      reaumur:          `${re.toFixed(4)} °Ré`,
      context,
      conversion_table: conversionTable,
    };
  },
};
