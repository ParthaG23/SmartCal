import { getPlanetaryPositions } from "../../../services/astroService";

export default {
  name: "Zodiac Chart Generator", slug: "zodiac", category: "Personal",
  description: "Determines your sun sign with pinpoint astronomical accuracy using v3 planetary engines",
  fields: [
    { name: "birthDate", label: "Date of Birth", type: "date" },
    { name: "birthTime", label: "Birth Time (Optional)", type: "time" },
    { name: "birthPlace", label: "Birth City (Optional)", type: "text", hint: "e.g. London, UK" }
  ],
  run: async ({ birthDate, birthTime, birthPlace }) => {
    if (!birthDate) throw new Error("Birth date required");

    // ── Flexible Date Parsing ──
    const parts = birthDate.split("-").map(Number);
    let yyyy, mm, dd;
    if (parts[0] > 1000) {
      [yyyy, mm, dd] = parts;
    } else {
      [dd, mm, yyyy] = parts;
    }

    const d = new Date(yyyy, mm - 1, dd), month = d.getMonth() + 1, day = d.getDate();
    
    // ── Parse optional time ──
    let hour = 12, min = 0;
    if (birthTime) {
      const [h, m] = birthTime.split(":").map(Number);
      hour = h; min = m;
    }

    // ── Attempt API Fetch (AstroAPI v3) ───────────────────────────────────
    const apiPositions = await getPlanetaryPositions(day, month, yyyy, hour, min);
    
    // Extract Sun Sign from API if available
    let apiSign = null;
    if (apiPositions?.data) {
      const sun = apiPositions.data.find(p => p.name?.toLowerCase() === "sun");
      if (sun && sun.sign) {
        // v3 usually returns sign as "Aries", "Taurus", etc.
        apiSign = sun.sign.charAt(0).toUpperCase() + sun.sign.slice(1).toLowerCase();
      }
    }

    const signs = [
      { sign: "Capricorn", start: [1,1], end: [1,19], element: "Earth", quality: "Cardinal", stone: "Garnet" },
      { sign: "Aquarius", start: [1,20], end: [2,18], element: "Air", quality: "Fixed", stone: "Amethyst" },
      { sign: "Pisces", start: [2,19], end: [3,20], element: "Water", quality: "Mutable", stone: "Aquamarine" },
      { sign: "Aries", start: [3,21], end: [4,19], element: "Fire", quality: "Cardinal", stone: "Diamond" },
      { sign: "Taurus", start: [4,20], end: [5,20], element: "Earth", quality: "Fixed", stone: "Emerald" },
      { sign: "Gemini", start: [5,21], end: [6,20], element: "Air", quality: "Mutable", stone: "Pearl" },
      { sign: "Cancer", start: [6,21], end: [7,22], element: "Water", quality: "Cardinal", stone: "Ruby" },
      { sign: "Leo", start: [7,23], end: [8,22], element: "Fire", quality: "Fixed", stone: "Peridot" },
      { sign: "Virgo", start: [8,23], end: [9,22], element: "Earth", quality: "Mutable", stone: "Sapphire" },
      { sign: "Libra", start: [9,23], end: [10,22], element: "Air", quality: "Cardinal", stone: "Opal" },
      { sign: "Scorpio", start: [10,23], end: [11,21], element: "Water", quality: "Fixed", stone: "Topaz" },
      { sign: "Sagittarius", start: [11,22], end: [12,21], element: "Fire", quality: "Mutable", stone: "Turquoise" },
      { sign: "Capricorn", start: [12,22], end: [12,31], element: "Earth", quality: "Cardinal", stone: "Garnet" }
    ];

    // Priority 1: API Result | Priority 2: Local Table
    const md = month * 100 + day;
    const localFound = signs.find(s => {
      const smd = s.start[0] * 100 + s.start[1], emd = s.end[0] * 100 + s.end[1];
      return md >= smd && md <= emd;
    }) || signs[0];

    const finalSign = apiSign || localFound.sign;
    const found = signs.find(s => s.sign === finalSign) || localFound;

    return {
      success: apiSign ? "✓ Verified via AstroAPI" : "Local approximation",
      zodiac_sign: found.sign,
      element: found.element,
      quality: found.quality,
      birthstone: found.stone,
      // If API available, we could add degrees here
      sun_degree: (() => {
        const deg = apiPositions?.data?.find(p => p.name?.toLowerCase() === "sun")?.full_degree;
        return deg !== undefined ? deg.toFixed(2) + "°" : "N/A";
      })()
    };
  }
};