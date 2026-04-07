export default {
  name: "Travel Time / ETA", slug: "eta", category: "Travel",
  description: "Estimates arrival time considering speed, distance, and planned stops",
  fields: [
    { name: "distance", label: "Distance (km)", type: "number", placeholder: "500" },
    { name: "averageSpeed", label: "Average Speed (km/h)", type: "number", placeholder: "80" },
    { name: "stops", label: "Number of Stops", type: "number", placeholder: "2" },
    { name: "stopDuration", label: "Avg Stop Duration (min)", type: "number", placeholder: "20" },
    { name: "departureTime", label: "Departure Time (HH:MM)", type: "text", placeholder: "08:00" }
  ],
  run: ({ distance, averageSpeed, stops = 0, stopDuration = 0, departureTime = "08:00" }) => {
    const d = parseFloat(distance), s = parseFloat(averageSpeed), st = parseInt(stops) || 0, sd = parseInt(stopDuration) || 0;
    if (!d || !s) throw new Error("Distance and speed required");
    const driveHours = d / s, stopHours = (st * sd) / 60, totalHours = driveHours + stopHours;
    const hrs = Math.floor(totalHours), mins = Math.round((totalHours - hrs) * 60);
    const [dh, dm] = departureTime.split(":").map(Number);
    const arrivalMin = (dh || 8) * 60 + (dm || 0) + totalHours * 60;
    const ah = Math.floor((arrivalMin % 1440) / 60), am = Math.round(arrivalMin % 60);
    const ampm = ah >= 12 ? "PM" : "AM";
    return {
      drive_time: Math.floor(driveHours) + "h " + Math.round((driveHours % 1) * 60) + "m",
      stop_time: st > 0 ? (st * sd) + " min total" : "No stops",
      total_travel_time: hrs + "h " + mins + "m",
      estimated_arrival: (ah % 12 || 12) + ":" + String(am).padStart(2, "0") + " " + ampm,
      avg_speed: s + " km/h",
      fuel_estimate: (d / 15).toFixed(1) + " L (at 15 km/L)"
    };
  }
};