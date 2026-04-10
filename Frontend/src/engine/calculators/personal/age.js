import { getPlanetaryPositions } from "../../../services/astroService";
import {
  mdiZodiacAries, mdiZodiacTaurus, mdiZodiacGemini, mdiZodiacCancer,
  mdiZodiacLeo, mdiZodiacVirgo, mdiZodiacLibra, mdiZodiacScorpio,
  mdiZodiacSagittarius, mdiZodiacCapricorn, mdiZodiacAquarius, mdiZodiacPisces,
} from "@mdi/js";

export const ZODIAC_MDI_PATH = {
  Aries:       mdiZodiacAries,
  Taurus:      mdiZodiacTaurus,
  Gemini:      mdiZodiacGemini,
  Cancer:      mdiZodiacCancer,
  Leo:         mdiZodiacLeo,
  Virgo:       mdiZodiacVirgo,
  Libra:       mdiZodiacLibra,
  Scorpio:     mdiZodiacScorpio,
  Sagittarius: mdiZodiacSagittarius,
  Capricorn:   mdiZodiacCapricorn,
  Aquarius:    mdiZodiacAquarius,
  Pisces:      mdiZodiacPisces,
};

const ZODIAC_SYMBOL = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const ZODIAC_DATES = {
  Aries:       "Mar 21 – Apr 19",
  Taurus:      "Apr 20 – May 20",
  Gemini:      "May 21 – Jun 20",
  Cancer:      "Jun 21 – Jul 22",
  Leo:         "Jul 23 – Aug 22",
  Virgo:       "Aug 23 – Sep 22",
  Libra:       "Sep 23 – Oct 22",
  Scorpio:     "Oct 23 – Nov 21",
  Sagittarius: "Nov 22 – Dec 21",
  Capricorn:   "Dec 22 – Jan 19",
  Aquarius:    "Jan 20 – Feb 18",
  Pisces:      "Feb 19 – Mar 20",
};

function getZodiac(month, day) {
  if      ((month === 3  && day >= 21) || (month === 4  && day <= 19)) return "Aries";
  else if ((month === 4  && day >= 20) || (month === 5  && day <= 20)) return "Taurus";
  else if ((month === 5  && day >= 21) || (month === 6  && day <= 20)) return "Gemini";
  else if ((month === 6  && day >= 21) || (month === 7  && day <= 22)) return "Cancer";
  else if ((month === 7  && day >= 23) || (month === 8  && day <= 22)) return "Leo";
  else if ((month === 8  && day >= 23) || (month === 9  && day <= 22)) return "Virgo";
  else if ((month === 9  && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1  && day <= 19)) return "Capricorn";
  else if ((month === 1  && day >= 20) || (month === 2  && day <= 18)) return "Aquarius";
  else                                                                  return "Pisces";
}

export default {
  name: "Age Calculator",
  slug: "age",
  category: "Personal",
  description: "Calculate exact age with years, months, days, hours and next birthday countdown",
  fields: [
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "birthTime", label: "Birth Time (Optional)", type: "time" },
    { name: "birthPlace", label: "Birth City (Optional)", type: "text", placeholder: "e.g. New Delhi, India" }
  ],
  run: async ({ dob, birthTime, birthPlace }) => {
    if (!dob) throw new Error("Date of birth is required");

    // ── Flexible Date Parsing ──
    const parts = dob.split("-").map(Number);
    let yyyy, mm, dd;
    
    if (parts[0] > 1000) {
      // YYYY-MM-DD (Standard)
      [yyyy, mm, dd] = parts;
    } else {
      // DD-MM-YYYY or MM-DD-YYYY? Usually DD-MM-YYYY on browsers
      [dd, mm, yyyy] = parts;
    }

    const birth = new Date(yyyy, mm - 1, dd), now = new Date();
    if (isNaN(birth.getTime())) throw new Error("Invalid date of birth");
    if (birth > now) throw new Error("Date of birth cannot be in the future");

    let years = now.getFullYear() - birth.getFullYear(), months = now.getMonth() - birth.getMonth(), days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now - birth) / 86_400_000), totalWeeks = Math.floor(totalDays / 7), totalMonths = years * 12 + months;
    const totalHours = totalDays * 24, totalMinutes = totalHours * 60;

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday - now) / 86_400_000);

    const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bornOn = WEEK_DAYS[birth.getDay()];
    const birthMonth = birth.getMonth() + 1, birthDay = birth.getDate();

    let hour = 12, min = 0;
    if (birthTime) {
      const [h, m] = birthTime.split(":").map(Number);
      hour = h; min = m;
    }

    const apiPositions = await getPlanetaryPositions(birthDay, birthMonth, yyyy, hour, min);
    let apiSign = null;
    if (apiPositions?.data) {
      const sun = apiPositions.data.find(p => p.name?.toLowerCase() === "sun");
      if (sun && sun.sign) {
        apiSign = sun.sign.charAt(0).toUpperCase() + sun.sign.slice(1).toLowerCase();
      }
    }

    const zodiacKey = apiSign || getZodiac(birthMonth, birthDay);

    return {
      age: `${years} yrs, ${months} mos, ${days} days`,
      status: apiSign ? "✓ Verified Astro-Data" : "Local calculation",
      years, months_remainder: months, days_remainder: days,
      total_days: totalDays.toLocaleString(), total_weeks: totalWeeks.toLocaleString(), total_months: totalMonths,
      total_hours: totalHours.toLocaleString(), total_minutes: totalMinutes.toLocaleString(),
      next_birthday: `${daysToNext} days`, born_on: bornOn,
      zodiac_key: zodiacKey,
      zodiac: `${ZODIAC_SYMBOL[zodiacKey]} ${zodiacKey}`,
      zodiac_dates: ZODIAC_DATES[zodiacKey],
    };
  },
};