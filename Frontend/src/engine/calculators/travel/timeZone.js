export default {
  name: "Time Zone Converter", slug: "time-zone", category: "Travel",
  description: "Converts time between different global time zones",
  fields: [
    { name: "hours", label: "Hour (0-23)", type: "number", placeholder: "14" },
    { name: "minutes", label: "Minutes", type: "number", placeholder: "30" },
    { name: "fromOffset", label: "From UTC Offset (hours)", type: "number", placeholder: "5.5", hint: "India = 5.5, US EST = -5, UK = 0" },
    { name: "toOffset", label: "To UTC Offset (hours)", type: "number", placeholder: "-5" }
  ],
  run: ({ hours, minutes = 0, fromOffset, toOffset }) => {
    const h = parseInt(hours), m = parseInt(minutes) || 0, from = parseFloat(fromOffset), to = parseFloat(toOffset);
    if (isNaN(h) || isNaN(from) || isNaN(to)) throw new Error("Hour and offsets required");
    const totalMin = h * 60 + m - from * 60 + to * 60;
    const newH = ((Math.floor(totalMin / 60) % 24) + 24) % 24, newM = ((totalMin % 60) + 60) % 60;
    const diff = to - from;
    const dayChange = totalMin < 0 ? "Previous day" : totalMin >= 1440 ? "Next day" : "Same day";
    const ampm = newH >= 12 ? "PM" : "AM";
    return {
      converted_time: (newH % 12 || 12) + ":" + String(Math.round(newM)).padStart(2, "0") + " " + ampm,
      converted_24h: String(newH).padStart(2, "0") + ":" + String(Math.round(newM)).padStart(2, "0"),
      time_difference: (diff > 0 ? "+" : "") + diff + " hours",
      day_change: dayChange,
      utc_time: String(((h * 60 + m - from * 60) / 60 + 24) % 24 | 0).padStart(2, "0") + ":" + String(m).padStart(2, "0") + " UTC",
      direction: diff > 0 ? "Ahead →" : diff < 0 ? "Behind ←" : "Same timezone"
    };
  }
};