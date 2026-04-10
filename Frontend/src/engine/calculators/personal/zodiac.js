export default {
  name: "Zodiac Chart Generator", slug: "zodiac", category: "Personal",
  description: "Determines your sun sign, element, quality, and birthstone from your birthday",
  fields: [
    { name: "birthDate", label: "Date of Birth", type: "date" }
  ],
  run: ({ birthDate }) => {
    if (!birthDate) throw new Error("Birth date required");
    const [yyyy, mm, dd] = birthDate.split("-").map(Number);
    const d = new Date(yyyy, mm - 1, dd), month = d.getMonth() + 1, day = d.getDate();
    const signs = [
      { sign: "Capricorn", start: [1,1], end: [1,19], element: "Earth", quality: "Cardinal", ruler: "Saturn", stone: "Garnet" },
      { sign: "Aquarius", start: [1,20], end: [2,18], element: "Air", quality: "Fixed", ruler: "Uranus", stone: "Amethyst" },
      { sign: "Pisces", start: [2,19], end: [3,20], element: "Water", quality: "Mutable", ruler: "Neptune", stone: "Aquamarine" },
      { sign: "Aries", start: [3,21], end: [4,19], element: "Fire", quality: "Cardinal", ruler: "Mars", stone: "Diamond" },
      { sign: "Taurus", start: [4,20], end: [5,20], element: "Earth", quality: "Fixed", ruler: "Venus", stone: "Emerald" },
      { sign: "Gemini", start: [5,21], end: [6,20], element: "Air", quality: "Mutable", ruler: "Mercury", stone: "Pearl" },
      { sign: "Cancer", start: [6,21], end: [7,22], element: "Water", quality: "Cardinal", ruler: "Moon", stone: "Ruby" },
      { sign: "Leo", start: [7,23], end: [8,22], element: "Fire", quality: "Fixed", ruler: "Sun", stone: "Peridot" },
      { sign: "Virgo", start: [8,23], end: [9,22], element: "Earth", quality: "Mutable", ruler: "Mercury", stone: "Sapphire" },
      { sign: "Libra", start: [9,23], end: [10,22], element: "Air", quality: "Cardinal", ruler: "Venus", stone: "Opal" },
      { sign: "Scorpio", start: [10,23], end: [11,21], element: "Water", quality: "Fixed", ruler: "Pluto", stone: "Topaz" },
      { sign: "Sagittarius", start: [11,22], end: [12,21], element: "Fire", quality: "Mutable", ruler: "Jupiter", stone: "Turquoise" },
      { sign: "Capricorn", start: [12,22], end: [12,31], element: "Earth", quality: "Cardinal", ruler: "Saturn", stone: "Garnet" }
    ];
    const md = month * 100 + day;
    const found = signs.find(s => {
      const smd = s.start[0] * 100 + s.start[1], emd = s.end[0] * 100 + s.end[1];
      return md >= smd && md <= emd;
    }) || signs[0];
    const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    return {
      zodiac_sign: found.sign + " ♈",
      element: found.element,
      quality: found.quality,
      ruling_planet: found.ruler,
      birthstone: found.stone,
      lucky_number: ((day % 9) + 1).toString(),
      day_of_year: dayOfYear.toString()
    };
  }
};