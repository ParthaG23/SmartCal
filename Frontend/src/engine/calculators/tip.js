export default {
  name: "Tip Calculator",
  slug: "tip",
  category: "Personal",
  description: "Smart tipping with custom %, bill split, per-person breakdown and etiquette hints",

  fields: [
    { name: "billAmount",  label: "Bill Amount", type: "number", placeholder: "1500", units: ["₹","$","€","£"], defaultUnit: "₹" },
    { name: "tipPercent",  label: "Tip Percentage", type: "number", placeholder: "15" },
    { name: "numPeople",   label: "Number of People", type: "number", placeholder: "1" },
    { name: "serviceLevel", label: "Service Level (optional)", type: "select", options: [
      { value: "poor",       label: "Poor (5-10%)"       },
      { value: "average",    label: "Average (10-15%)"   },
      { value: "good",       label: "Good (15-20%)"      },
      { value: "excellent",  label: "Excellent (20-25%)" },
      { value: "custom",     label: "Custom"             },
    ]},
  ],

  run: ({ billAmount, tipPercent, numPeople = 1, serviceLevel = "custom" }) => {
    const bill   = parseFloat(billAmount);
    let   tipPct = parseFloat(tipPercent) || 0;
    const people = Math.max(1, parseInt(numPeople, 10) || 1);

    if (!bill || bill <= 0) throw new Error("A valid bill amount is required");

    // Auto-suggest if not custom
    if (serviceLevel !== "custom") {
      const suggestions = { poor: 7.5, average: 12.5, good: 17.5, excellent: 22.5 };
      tipPct = suggestions[serviceLevel] || tipPct;
    }

    const tipAmount   = (bill * tipPct) / 100;
    const totalAmount = bill + tipAmount;
    const perPerson   = totalAmount / people;
    const tipPerPerson = tipAmount / people;

    const tipOptions = [5, 10, 12, 15, 18, 20, 25, 30].map(pct => ({
      percent:  pct,
      tip:      parseFloat(((bill * pct) / 100).toFixed(2)),
      total:    parseFloat((bill + (bill * pct) / 100).toFixed(2)),
      per_person: parseFloat(((bill + (bill * pct) / 100) / people).toFixed(2)),
    }));

    const splitOptions = [1, 2, 3, 4, 5, 6, 8, 10].map(p => ({
      people: p,
      per_person: parseFloat((totalAmount / p).toFixed(2)),
    }));

    const roundUp = Math.ceil(totalAmount);
    const extraTip = roundUp - totalAmount;

    const etiquette =
      tipPct < 5   ? "Below standard — typically reserved for very poor service" :
      tipPct < 10  ? "Minimal — may signal dissatisfaction" :
      tipPct < 15  ? "Standard — for average service" :
      tipPct < 20  ? "Generous — for good service 👍" :
      tipPct < 25  ? "Very generous — excellent! 🌟" :
                     "Exceptional generosity — outstanding! 🎉";

    return {
      tip_amount:       `₹${tipAmount.toFixed(2)}`,
      total_amount:     `₹${totalAmount.toFixed(2)}`,
      tip_percentage:   `${tipPct.toFixed(1)}%`,
      per_person_total: `₹${perPerson.toFixed(2)}`,
      per_person_tip:   `₹${tipPerPerson.toFixed(2)}`,
      round_up_total:   `₹${roundUp}`,
      round_up_bonus:   `₹${extraTip.toFixed(2)}`,
      etiquette_hint:   etiquette,
      tip_options:      tipOptions,
      split_options:    splitOptions,
    };
  },
};
