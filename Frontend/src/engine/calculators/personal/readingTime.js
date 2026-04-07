export default {
  name: "Reading Time Speed Tool", slug: "reading-time", category: "Personal",
  description: "Estimates how long it will take to read based on word count and reading speed",
  fields: [
    { name: "totalWords", label: "Total Words", type: "number", placeholder: "50000", hint: "Average novel: 80,000 words" },
    { name: "readingSpeed", label: "Reading Speed (WPM)", type: "number", placeholder: "250", hint: "Average: 200-300 WPM" }
  ],
  run: ({ totalWords, readingSpeed }) => {
    const words = parseFloat(totalWords), wpm = parseFloat(readingSpeed) || 250;
    if (!words) throw new Error("Total words required");
    const totalMin = words / wpm, hours = Math.floor(totalMin / 60), mins = Math.round(totalMin % 60);
    const pages = Math.ceil(words / 250);
    const sessions = Math.ceil(totalMin / 30);
    return {
      reading_time: hours + "h " + mins + "m",
      total_minutes: totalMin.toFixed(0) + " min",
      estimated_pages: pages + " pages",
      sessions_30min: sessions + " sessions",
      daily_30min: Math.ceil(totalMin / 30) + " days",
      daily_1hr: Math.ceil(totalMin / 60) + " days",
      words_per_page: "~250 words/page",
      speed_used: wpm + " WPM"
    };
  }
};