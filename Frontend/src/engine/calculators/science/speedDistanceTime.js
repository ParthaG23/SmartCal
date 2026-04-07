export default {
  name: "Speed, Distance, Time", slug: "speed-distance-time", category: "Science",
  description: "Solves for the missing variable in the velocity equation v = d/t",
  fields: [
    { name: "solveFor", label: "Solve For", type: "select", options: [
      { value: "speed", label: "Speed" }, { value: "distance", label: "Distance" }, { value: "time", label: "Time" }
    ]},
    { name: "speed", label: "Speed (km/h)", type: "number", placeholder: "60", hint: "Leave empty if solving for speed" },
    { name: "distance", label: "Distance (km)", type: "number", placeholder: "120", hint: "Leave empty if solving for distance" },
    { name: "time", label: "Time (hours)", type: "number", placeholder: "2", hint: "Leave empty if solving for time" }
  ],
  run: ({ solveFor, speed, distance, time }) => {
    let s = parseFloat(speed), d = parseFloat(distance), t = parseFloat(time);
    if (solveFor === "speed") { if (!d || !t) throw new Error("Distance and time required"); s = d / t; }
    else if (solveFor === "distance") { if (!s || !t) throw new Error("Speed and time required"); d = s * t; }
    else { if (!s || !d) throw new Error("Speed and distance required"); t = d / s; }
    const hours = Math.floor(t), mins = Math.round((t - hours) * 60);
    return {
      speed: s.toFixed(2) + " km/h",
      distance: d.toFixed(2) + " km",
      time: t.toFixed(4) + " hours",
      time_formatted: hours + "h " + mins + "m",
      speed_mps: (s / 3.6).toFixed(2) + " m/s",
      speed_mph: (s * 0.621371).toFixed(2) + " mph",
      distance_miles: (d * 0.621371).toFixed(2) + " miles"
    };
  }
};