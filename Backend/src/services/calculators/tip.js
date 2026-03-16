module.exports = {
  name: "Tip Calculator",
  slug: "tip",
  category: "Personal",
  description: "Restaurant tip with split, custom amounts, rounding options and tip percentage guide",

  fields: [
    {
      name: "bill",
      label: "Bill Amount",
      type: "number",
      placeholder: "800",
      units: ["₹", "$", "€", "£"],
      defaultUnit: "₹",
    },
    {
      name: "tipPercent",
      label: "Tip Percentage",
      type: "number",
      placeholder: "15",
      units: ["5%", "10%", "15%", "18%", "20%", "25%", "custom"],
      defaultUnit: "custom",
    },
    {
      name: "people",
      label: "Split Between",
      type: "number",
      placeholder: "2",
    },
    {
      name: "roundUp",
      label: "Rounding",
      type: "select",
      options: [
        { value: "none",   label: "No rounding"           },
        { value: "round",  label: "Round to nearest ₹10"  },
        { value: "up",     label: "Round up to nearest ₹10" },
        { value: "down",   label: "Round down to nearest ₹10" },
      ],
    },
  ],

  run: ({ bill, tipPercent, people = 1, roundUp = "none" }) => {
    const b   = parseFloat(bill);
    const t   = parseFloat(tipPercent) || 0;
    const pax = Math.max(1, parseInt(people, 10) || 1);

    if (!b || b <= 0) throw new Error("Bill amount is required");

    const tipAmount  = (b * t) / 100;
    let   total      = b + tipAmount;

    // ── Rounding ──
    if (roundUp === "round") total = Math.round(total / 10) * 10;
    if (roundUp === "up")    total = Math.ceil(total  / 10) * 10;
    if (roundUp === "down")  total = Math.floor(total / 10) * 10;

    const adjustedTip = total - b;
    const perPerson   = total / pax;

    // ── All common tip options ──
    const tipOptions = [0, 5, 10, 15, 18, 20, 25].map(pct => ({
      percent:    pct,
      tip:        parseFloat(((b * pct) / 100).toFixed(2)),
      total:      parseFloat((b + (b * pct) / 100).toFixed(2)),
      per_person: parseFloat(((b + (b * pct) / 100) / pax).toFixed(2)),
    }));

    // ── Service quality guide ──
    const serviceGuide =
      t <= 0  ? "No tip — poor service or personal preference" :
      t < 10  ? "Below average — below expectations"          :
      t < 15  ? "Acceptable — adequate service"               :
      t < 18  ? "Good — standard US/global tip"               :
      t < 22  ? "Great — above expectations"                  :
      t < 25  ? "Excellent — exceptional service"             :
                "Outstanding — going above and beyond";

    return {
      tip_amount:       `₹${adjustedTip.toFixed(2)}`,
      total_bill:       `₹${total.toFixed(2)}`,
      per_person:       `₹${perPerson.toFixed(2)}`,
      tip_percent:      `${t}%`,
      service_rating:   serviceGuide,
      tip_options:      tipOptions,
    };
  },
};
