export default {
  name: "Pace Calculator", slug: "pace", category: "Travel",
  description: "Calculates running or walking pace and estimates race finish times",
  fields: [
    { name: "distance", label: "Distance", type: "number", placeholder: "5" },
    { name: "distanceUnit", label: "Unit", type: "select", options: [
      { value: "km", label: "Kilometers" }, { value: "miles", label: "Miles" }
    ]},
    { name: "timeMinutes", label: "Total Time (minutes)", type: "number", placeholder: "25" }
  ],
  run: ({ distance, distanceUnit = "km", timeMinutes }) => {
    const d = parseFloat(distance), t = parseFloat(timeMinutes);
    if (!d || !t) throw new Error("Distance and time required");
    const pace = t / d;
    const speed = d / (t / 60);
    const km = distanceUnit === "miles" ? d * 1.60934 : d;
    const fmtPace = (p) => Math.floor(p) + ":" + String(Math.round((p % 1) * 60)).padStart(2, "0");
    const est5k = pace * 5 / (distanceUnit === "miles" ? 1.60934 : 1);
    const est10k = pace * 10 / (distanceUnit === "miles" ? 1.60934 : 1);
    const estHalf = pace * 21.1 / (distanceUnit === "miles" ? 1.60934 : 1);
    const estFull = pace * 42.2 / (distanceUnit === "miles" ? 1.60934 : 1);
    return {
      pace: fmtPace(pace) + " min/" + (distanceUnit === "km" ? "km" : "mi"),
      speed: speed.toFixed(2) + " " + distanceUnit + "/h",
      est_5k: Math.floor(est5k) + ":" + String(Math.round((est5k % 1) * 60)).padStart(2, "0"),
      est_10k: Math.floor(est10k) + ":" + String(Math.round((est10k % 1) * 60)).padStart(2, "0"),
      est_half_marathon: Math.floor(estHalf / 60) + "h " + Math.round(estHalf % 60) + "m",
      est_marathon: Math.floor(estFull / 60) + "h " + Math.round(estFull % 60) + "m",
      calories_est: (km * 65).toFixed(0) + " kcal (avg)"
    };
  }
};