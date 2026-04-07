export default {
  name: "Clothing Size Converter", slug: "clothing-size", category: "Shopping",
  description: "Converts clothing sizes between US, UK, and EU standards",
  fields: [
    { name: "size", label: "Your Size Number", type: "number", placeholder: "10" },
    { name: "fromRegion", label: "From Region", type: "select", options: [
      { value: "US", label: "US" }, { value: "UK", label: "UK" }, { value: "EU", label: "EU" }
    ]},
    { name: "garment", label: "Garment Type", type: "select", options: [
      { value: "tops", label: "Tops / Shirts" }, { value: "shoes", label: "Shoes" }
    ]}
  ],
  run: ({ size, fromRegion, garment }) => {
    const s = parseFloat(size);
    if (!s) throw new Error("Size is required");
    let us, uk, eu;
    if (garment === "shoes") {
      if (fromRegion === "US") { us = s; uk = s - 0.5; eu = s + 33; }
      else if (fromRegion === "UK") { uk = s; us = s + 0.5; eu = s + 33.5; }
      else { eu = s; us = s - 33; uk = s - 33.5; }
    } else {
      if (fromRegion === "US") { us = s; uk = s + 4; eu = s + 30; }
      else if (fromRegion === "UK") { uk = s; us = s - 4; eu = s + 26; }
      else { eu = s; us = s - 30; uk = s - 26; }
    }
    return {
      us_size: us.toFixed(1),
      uk_size: uk.toFixed(1),
      eu_size: eu.toFixed(1),
      garment_type: garment === "shoes" ? "Footwear" : "Clothing",
      original: fromRegion + " " + s,
      note: "Sizes are approximate — check brand guides"
    };
  }
};