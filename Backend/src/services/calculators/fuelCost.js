module.exports = {
  name: "Fuel Cost Calculator",
  slug: "fuelCost",
  category: "Travel",
  description: "Trip fuel cost with CO₂ emissions, cost per km, and multi-vehicle comparison",

  fields: [
    {
      name: "distance",
      label: "Trip Distance",
      type: "number",
      placeholder: "500",
      units: ["km", "miles"],
      defaultUnit: "km",
    },
    {
      name: "mileage",
      label: "Fuel Efficiency",
      type: "number",
      placeholder: "15",
      units: ["km/L", "L/100km", "mpg"],
      defaultUnit: "km/L",
    },
    {
      name: "fuelPrice",
      label: "Fuel Price",
      type: "number",
      placeholder: "105",
      units: ["₹/L", "$/L", "$/gallon", "€/L"],
      defaultUnit: "₹/L",
    },
    {
      name: "passengers",
      label: "Passengers",
      type: "number",
      placeholder: "1",
    },
    {
      name: "fuelType",
      label: "Fuel Type",
      type: "select",
      options: [
        { value: "petrol",   label: "Petrol / Gasoline" },
        { value: "diesel",   label: "Diesel"            },
        { value: "cng",      label: "CNG"               },
        { value: "electric", label: "Electric (kWh/100km)" },
      ],
    },
  ],

  run: ({ distance, mileage, fuelPrice, passengers = 1, fuelType = "petrol",
          distanceUnit = "km", mileageUnit = "km/L", fuelPriceUnit = "₹/L" }) => {
    let d  = parseFloat(distance);
    let m  = parseFloat(mileage);
    let fp = parseFloat(fuelPrice);
    const pax = parseFloat(passengers) || 1;

    if (!d || !m || !fp) throw new Error("Distance, mileage, and fuel price are required");

    // ── Unit conversions ──
    if (distanceUnit === "miles")     d  *= 1.60934;
    if (mileageUnit  === "L/100km")   m  = 100 / m;          // convert L/100km → km/L
    if (mileageUnit  === "mpg")       m  = m * 1.60934 / 3.785411; // mpg → km/L
    if (fuelPriceUnit === "$/gallon") fp = fp / 3.785411;    // per gallon → per litre

    const litresNeeded = d / m;
    const totalCost    = litresNeeded * fp;
    const costPerKm    = totalCost / d;
    const costPerPax   = totalCost / pax;

    // ── CO₂ emissions (kg) ──
    const co2PerLitre = fuelType === "diesel" ? 2.68 : fuelType === "cng" ? 1.96 : 2.31;
    const co2Total    = fuelType === "electric" ? d * m / 100 * 0.233 : litresNeeded * co2PerLitre;
    const co2PerPax   = co2Total / pax;

    // ── Round-trip ──
    const roundTripCost = totalCost * 2;
    const roundTripCO2  = co2Total  * 2;

    // ── Cost at different fuel prices ──
    const priceRange = [80, 90, 100, 110, 120, 130, 140, 150].map(p => ({
      price: p, cost: parseFloat(((litresNeeded * p)).toFixed(2)),
    }));

    // ── Mileage sensitivity ──
    const mileageRange = [8, 10, 12, 15, 18, 20, 25, 30].map(ml => ({
      mileage: ml, cost: parseFloat(((d / ml) * fp).toFixed(2)), litres: parseFloat((d/ml).toFixed(2)),
    }));

    // ── Distance milestones ──
    const milestones = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(f => ({
      km:     Math.round(d * f),
      cost:   Math.round(totalCost * f),
      litres: parseFloat((litresNeeded * f).toFixed(1)),
    }));

    return {
      fuel_required:    `${litresNeeded.toFixed(2)} L`,
      total_cost:       `₹${totalCost.toFixed(2)}`,
      cost_per_km:      `₹${costPerKm.toFixed(4)}`,
      cost_per_person:  `₹${costPerPax.toFixed(2)}`,
      round_trip_cost:  `₹${roundTripCost.toFixed(2)}`,
      co2_emissions:    `${co2Total.toFixed(2)} kg`,
      co2_per_person:   `${co2PerPax.toFixed(2)} kg`,
      round_trip_co2:   `${roundTripCO2.toFixed(2)} kg`,
      price_sensitivity: priceRange,
      mileage_sensitivity: mileageRange,
      milestones,
    };
  },
};
