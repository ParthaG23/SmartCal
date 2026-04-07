export default {
  name: "Temperature Converter",
  slug: "temperature",
  category: "Converters",
  description: "Celsius, Fahrenheit, Kelvin with feels-like data and fun reference points",

  fields: [
    { name: "value", label: "Temperature", type: "number", placeholder: "37" },
    { name: "fromUnit", label: "From Unit", type: "select", options: [
      { value: "C", label: "Celsius (°C)" },
      { value: "F", label: "Fahrenheit (°F)" },
      { value: "K", label: "Kelvin (K)" },
    ]},
  ],

  run: ({ value, fromUnit = "C" }) => {
    const v = parseFloat(value);
    if (isNaN(v)) throw new Error("Temperature value required");

    let C, F, K;
    switch (fromUnit) {
      case "C": C = v; F = v*9/5+32;     K = v+273.15; break;
      case "F": C = (v-32)*5/9; F = v;   K = (v-32)*5/9+273.15; break;
      case "K": C = v-273.15; F = (v-273.15)*9/5+32; K = v; break;
      default:  throw new Error("Unknown unit");
    }

    if (K < 0) throw new Error("Temperature cannot be below absolute zero (0 K)");

    const feelsLike =
      C < -10 ? "Extreme cold ❄️ — frostbite risk" :
      C < 0   ? "Freezing 🥶"  :
      C < 10  ? "Very cold 🧥"  :
      C < 17  ? "Cool 🧣"       :
      C < 25  ? "Comfortable 😊":
      C < 33  ? "Warm ☀️"       :
      C < 40  ? "Hot 🔥 — stay hydrated" :
                "Extreme heat 🥵 — danger";

    const references = [
      { label: "Absolute zero",    celsius: -273.15 },
      { label: "Dry ice",          celsius: -78.5   },
      { label: "Water freezes",    celsius: 0       },
      { label: "Room temperature", celsius: 22      },
      { label: "Body temperature", celsius: 37      },
      { label: "Water boils",      celsius: 100     },
      { label: "Paper ignites",    celsius: 233     },
      { label: "Surface of Sun",   celsius: 5505    },
    ].map(r => ({
      ...r,
      fahrenheit: parseFloat((r.celsius*9/5+32).toFixed(1)),
      kelvin:     parseFloat((r.celsius+273.15).toFixed(2)),
      gap:        parseFloat((C - r.celsius).toFixed(2)),
    }));

    const conversionTable = Array.from({ length: 21 }, (_, i) => {
      const c = (i - 10) * 10;
      return { celsius: c, fahrenheit: parseFloat((c*9/5+32).toFixed(1)), kelvin: parseFloat((c+273.15).toFixed(2)) };
    });

    return {
      celsius:    `${C.toFixed(2)} °C`,
      fahrenheit: `${F.toFixed(2)} °F`,
      kelvin:     `${K.toFixed(2)} K`,
      feels_like: feelsLike,
      references,
      conversion_table: conversionTable,
    };
  },
};
