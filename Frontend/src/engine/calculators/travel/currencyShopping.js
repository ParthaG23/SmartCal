export default {
  name: "Currency Shopping Converter", slug: "currency-shopping", category: "Travel",
  description: "Converts shopping prices between currencies using exchange rates",
  fields: [
    { name: "amount", label: "Amount", type: "number", placeholder: "100" },
    { name: "exchangeRate", label: "Exchange Rate (1 foreign = X home)", type: "number", placeholder: "83.5", hint: "e.g. 1 USD = 83.5 INR" },
    { name: "fromCurrency", label: "From Currency", type: "text", placeholder: "USD" },
    { name: "toCurrency", label: "To Currency", type: "text", placeholder: "INR" }
  ],
  run: ({ amount, exchangeRate, fromCurrency = "USD", toCurrency = "INR" }) => {
    const amt = parseFloat(amount), rate = parseFloat(exchangeRate);
    if (!amt || !rate) throw new Error("Amount and exchange rate required");
    const converted = amt * rate, inverse = amt / rate;
    return {
      converted_amount: converted.toFixed(2) + " " + toCurrency,
      original_amount: amt.toFixed(2) + " " + fromCurrency,
      exchange_rate: "1 " + fromCurrency + " = " + rate.toFixed(4) + " " + toCurrency,
      inverse_rate: "1 " + toCurrency + " = " + (1/rate).toFixed(6) + " " + fromCurrency,
      for_100_units: (100 * rate).toFixed(2) + " " + toCurrency,
      for_1000_units: (1000 * rate).toFixed(2) + " " + toCurrency,
      budget_tip: "₹" + (amt * rate).toFixed(0) + " ≈ " + fromCurrency + " " + amt
    };
  }
};