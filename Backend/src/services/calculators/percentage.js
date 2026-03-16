module.exports = {
  name: "Percentage Calculator",
  slug: "percentage",
  category: "Math",
  description: "All percentage types: of a number, change, reverse, increase/decrease and ratio",

  fields: [
    {
      name: "mode",
      label: "Calculation Type",
      type: "select",
      options: [
        { value: "of",        label: "X% of Y  (e.g. 20% of 500)"      },
        { value: "whatPct",   label: "X is what % of Y"                  },
        { value: "change",    label: "% Change from X to Y"              },
        { value: "increase",  label: "Increase X by Y%"                  },
        { value: "decrease",  label: "Decrease X by Y%"                  },
        { value: "reverse",   label: "Reverse: Y is P% of what number?"  },
      ],
    },
    {
      name: "x",
      label: "Value X",
      type: "number",
      placeholder: "200",
    },
    {
      name: "y",
      label: "Value Y",
      type: "number",
      placeholder: "1000",
    },
  ],

  run: ({ mode = "of", x, y }) => {
    const X = parseFloat(x);
    const Y = parseFloat(y);

    let primaryLabel, primaryValue, secondaryResults = {};

    switch (mode) {
      case "of": {
        if (isNaN(X) || isNaN(Y)) throw new Error("Both X and Y required");
        const result = (X / 100) * Y;
        primaryLabel = `${X}% of ${Y}`;
        primaryValue = result.toFixed(4);
        secondaryResults = {
          remaining:       (Y - result).toFixed(4),
          complement_pct:  `${(100 - X).toFixed(2)}%`,
          ratio:           `${result.toFixed(2)} : ${(Y-result).toFixed(2)}`,
          as_decimal:      (X / 100).toFixed(6),
          as_fraction:     `${X}/100`,
        };
        break;
      }
      case "whatPct": {
        if (isNaN(X) || isNaN(Y) || Y === 0) throw new Error("X and non-zero Y required");
        const pct = (X / Y) * 100;
        primaryLabel = `${X} is what % of ${Y}`;
        primaryValue = `${pct.toFixed(4)}%`;
        secondaryResults = {
          complement:      `${(100-pct).toFixed(4)}%`,
          ratio:           `${X} : ${Y}`,
          simplified_ratio:`${(X/Math.min(X,Y)).toFixed(2)} : ${(Y/Math.min(X,Y)).toFixed(2)}`,
          as_decimal:      (X/Y).toFixed(6),
        };
        break;
      }
      case "change": {
        if (isNaN(X) || isNaN(Y) || X === 0) throw new Error("Non-zero X and Y required");
        const change = ((Y - X) / Math.abs(X)) * 100;
        primaryLabel = `% Change from ${X} to ${Y}`;
        primaryValue = `${change.toFixed(4)}%`;
        secondaryResults = {
          direction:       change >= 0 ? "Increase ↑" : "Decrease ↓",
          absolute_change: (Y - X).toFixed(4),
          multiplier:      (Y / X).toFixed(6),
          reverse_change:  `${((X-Y)/Math.abs(Y)*100).toFixed(4)}%`,
        };
        break;
      }
      case "increase": {
        if (isNaN(X) || isNaN(Y)) throw new Error("Both values required");
        const increased = X * (1 + Y/100);
        primaryLabel = `${X} increased by ${Y}%`;
        primaryValue = increased.toFixed(4);
        secondaryResults = {
          increase_amount: (increased - X).toFixed(4),
          multiplier:      `×${(1 + Y/100).toFixed(4)}`,
        };
        break;
      }
      case "decrease": {
        if (isNaN(X) || isNaN(Y)) throw new Error("Both values required");
        const decreased = X * (1 - Y/100);
        primaryLabel = `${X} decreased by ${Y}%`;
        primaryValue = decreased.toFixed(4);
        secondaryResults = {
          decrease_amount: (X - decreased).toFixed(4),
          multiplier:      `×${(1 - Y/100).toFixed(4)}`,
        };
        break;
      }
      case "reverse": {
        if (isNaN(X) || isNaN(Y) || Y === 0) throw new Error("X (value) and Y (%) required");
        const base = (X / Y) * 100;
        primaryLabel = `${X} is ${Y}% of what?`;
        primaryValue = base.toFixed(4);
        secondaryResults = {
          verification: `${Y}% of ${base.toFixed(2)} = ${X}`,
          complement:   (base - X).toFixed(4),
        };
        break;
      }
      default:
        throw new Error("Invalid mode");
    }

    return {
      result: primaryValue,
      label:  primaryLabel,
      ...secondaryResults,
    };
  },
};
