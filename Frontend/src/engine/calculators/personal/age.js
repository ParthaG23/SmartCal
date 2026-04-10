/**
 * Age Calculator
 *
 * Real zodiac icons via Material Design Icons:
 *   npm install @mdi/react @mdi/js
 *
 * Usage in your UI (e.g. ChartDashboard / results component):
 *
 *   import Icon from "@mdi/react";
 *   import { ZODIAC_MDI_PATH } from "./calculators/age";
 *
 *   <Icon path={ZODIAC_MDI_PATH[result.zodiac_key]} size={1.5} color={accent} />
 *
 * The calculator's `run()` returns `zodiac_key` (e.g. "Aries") so your
 * UI can look up the correct MDI path from the exported map below.
 */

import {
  mdiZodiacAries,
  mdiZodiacTaurus,
  mdiZodiacGemini,
  mdiZodiacCancer,
  mdiZodiacLeo,
  mdiZodiacVirgo,
  mdiZodiacLibra,
  mdiZodiacScorpio,
  mdiZodiacSagittarius,
  mdiZodiacCapricorn,
  mdiZodiacAquarius,
  mdiZodiacPisces,
} from "@mdi/js";

/* ─── Exported map: zodiac name → MDI SVG path data ─────────────────────────
   Import this in any component that needs to render the icon:

     import Icon from "@mdi/react";
     import { ZODIAC_MDI_PATH } from "./calculators/age";

     <Icon path={ZODIAC_MDI_PATH["Leo"]} size={2} color={accent} />
──────────────────────────────────────────────────────────────────────────── */
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

/* ─── Unicode fallback symbols (used in plain-text output) ──────────────── */
const ZODIAC_SYMBOL = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

/* ─── Date ranges (for display) ─────────────────────────────────────────── */
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

/* ─── Zodiac determination (corrected boundaries) ───────────────────────── */
function getZodiac(month, day) {
  // month is 1-based, day is 1-based
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
  else                                                                  return "Pisces"; // Feb 19 – Mar 20
}

/* ─── Calculator definition ─────────────────────────────────────────────── */
export default {
  name: "Age Calculator",
  slug: "age",
  category: "Personal",
  description: "Calculate exact age with years, months, days, hours and next birthday countdown",

  fields: [
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
    },
  ],

  run: ({ dob }) => {
    if (!dob) throw new Error("Date of birth is required");

    // ── Parse as LOCAL date to avoid UTC timezone shift ───────────────────
    // new Date("1990-05-15") → UTC midnight → shifts to May 14 in UTC+5:30
    // new Date(1990, 4, 15)  → local midnight → always May 15 ✓
    const [yyyy, mm, dd] = dob.split("-").map(Number);
    const birth = new Date(yyyy, mm - 1, dd);
    const now   = new Date();

    if (isNaN(birth.getTime()))   throw new Error("Invalid date of birth");
    if (birth > now)              throw new Error("Date of birth cannot be in the future");

    // ── Exact age components ──────────────────────────────────────────────
    let years  = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth()    - birth.getMonth();
    let days   = now.getDate()     - birth.getDate();

    if (days < 0) {
      months--;
      // How many days were in the month before this one?
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }
    if (months < 0) { years--; months += 12; }

    // ── Running totals ────────────────────────────────────────────────────
    const totalDays    = Math.floor((now - birth) / 86_400_000);
    const totalWeeks   = Math.floor(totalDays / 7);
    const totalMonths  = years * 12 + months;
    const totalHours   = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // ── Next birthday ─────────────────────────────────────────────────────
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday - now) / 86_400_000);

    // ── Day of week born ──────────────────────────────────────────────────
    const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bornOn    = WEEK_DAYS[birth.getDay()];

    // ── Zodiac — uses local month/day, not UTC-shifted values ─────────────
    const birthMonth = birth.getMonth() + 1; // 1–12
    const birthDay   = birth.getDate();      // 1–31
    const zodiacKey  = getZodiac(birthMonth, birthDay);

    return {
      // ── Primary display ──────────────────────────────────────────────────
      age:               `${years} yrs, ${months} mos, ${days} days`,

      // ── Age components ───────────────────────────────────────────────────
      years,
      months_remainder:  months,
      days_remainder:    days,

      // ── Running totals ───────────────────────────────────────────────────
      total_days:        totalDays.toLocaleString(),
      total_weeks:       totalWeeks.toLocaleString(),
      total_months:      totalMonths,
      total_hours:       totalHours.toLocaleString(),
      total_minutes:     totalMinutes.toLocaleString(),

      // ── Birthday info ────────────────────────────────────────────────────
      next_birthday:     `${daysToNext} days`,
      born_on:           bornOn,

      // ── Zodiac ───────────────────────────────────────────────────────────
      // zodiac_key   → use with ZODIAC_MDI_PATH[zodiac_key] for the real SVG icon
      // zodiac       → human-readable label with unicode symbol
      // zodiac_dates → date range string for display
      zodiac_key:        zodiacKey,
      zodiac:            `${ZODIAC_SYMBOL[zodiacKey]} ${zodiacKey}`,
      zodiac_dates:      ZODIAC_DATES[zodiacKey],
    };
  },
};