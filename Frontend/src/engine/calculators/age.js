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

    const birth = new Date(dob);
    const now   = new Date();

    if (birth > now) throw new Error("Date of birth cannot be in the future");

    let years  = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth()    - birth.getMonth();
    let days   = now.getDate()     - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays    = Math.floor((now - birth) / 86400000);
    const totalWeeks   = Math.floor(totalDays / 7);
    const totalMonths  = years * 12 + months;
    const totalHours   = totalDays * 24;
    const totalMinutes = totalHours * 60;

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday - now) / 86400000);

    const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const bornOn   = weekDays[birth.getDay()];

    const m = birth.getMonth() + 1;
    const d = birth.getDate();
    const zodiac =
      (m===1&&d>=20)||(m===2&&d<=18) ? "Aquarius ♒" :
      (m===2&&d>=19)||(m===3&&d<=20) ? "Pisces ♓"   :
      (m===3&&d>=21)||(m===4&&d<=19) ? "Aries ♈"    :
      (m===4&&d>=20)||(m===5&&d<=20) ? "Taurus ♉"   :
      (m===5&&d>=21)||(m===6&&d<=20) ? "Gemini ♊"   :
      (m===6&&d>=21)||(m===7&&d<=22) ? "Cancer ♋"   :
      (m===7&&d>=23)||(m===8&&d<=22) ? "Leo ♌"      :
      (m===8&&d>=23)||(m===9&&d<=22) ? "Virgo ♍"    :
      (m===9&&d>=23)||(m===10&&d<=22)? "Libra ♎"    :
      (m===10&&d>=23)||(m===11&&d<=21)?"Scorpio ♏"  :
      (m===11&&d>=22)||(m===12&&d<=21)?"Sagittarius ♐":
                                        "Capricorn ♑";

    return {
      age:             `${years} yrs, ${months} mos, ${days} days`,
      years,
      months_remainder: months,
      days_remainder:   days,
      total_days:       totalDays,
      total_weeks:      totalWeeks,
      total_months:     totalMonths,
      total_hours:      totalHours.toLocaleString(),
      total_minutes:    totalMinutes.toLocaleString(),
      next_birthday:    `${daysToNext} days`,
      born_on:          bornOn,
      zodiac,
    };
  },
};
