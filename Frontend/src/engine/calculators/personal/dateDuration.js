export default {
  name: "Date Duration/Difference", slug: "date-duration", category: "Personal",
  description: "Calculates the exact number of days, weeks, and months between two dates",
  fields: [
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" }
  ],
  run: ({ startDate, endDate }) => {
    if (!startDate || !endDate) throw new Error("Both dates required");
    const s = new Date(startDate), e = new Date(endDate);
    if (isNaN(s) || isNaN(e)) throw new Error("Invalid date format");
    const diffMs = Math.abs(e - s), diffDays = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(diffDays / 7), remainDays = diffDays % 7;
    const months = Math.floor(diffDays / 30.44), years = Math.floor(diffDays / 365.25);
    const hours = diffDays * 24, minutes = hours * 60;
    const businessDays = Math.floor(diffDays * 5 / 7);
    return {
      total_days: diffDays + " days",
      weeks_and_days: weeks + " weeks, " + remainDays + " days",
      months_approx: months + " months",
      years_approx: years + " years, " + (diffDays - Math.floor(years * 365.25)).toFixed(0) + " days",
      total_hours: hours.toLocaleString() + " hours",
      total_minutes: minutes.toLocaleString() + " minutes",
      business_days: businessDays + " approx"
    };
  }
};