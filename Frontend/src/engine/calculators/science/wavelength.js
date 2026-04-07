export default {
  name: "Wavelength Frequency", slug: "wavelength", category: "Science",
  description: "Connects wave speed, frequency, and wavelength for any wave type",
  fields: [
    { name: "frequency", label: "Frequency (Hz)", type: "number", placeholder: "1000" },
    { name: "waveSpeed", label: "Wave Speed (m/s)", type: "number", placeholder: "343", hint: "343 for sound, 3×10⁸ for light" }
  ],
  run: ({ frequency, waveSpeed }) => {
    const f = parseFloat(frequency), v = parseFloat(waveSpeed) || 343;
    if (!f) throw new Error("Frequency is required");
    const lambda = v / f, period = 1 / f;
    const waveNumber = 2 * Math.PI / lambda;
    const isSound = Math.abs(v - 343) < 50;
    const isLight = v > 1e6;
    return {
      wavelength: lambda.toFixed(6) + " m",
      wavelength_cm: (lambda * 100).toFixed(4) + " cm",
      period: period.toFixed(8) + " s",
      wave_number: waveNumber.toFixed(4) + " rad/m",
      angular_frequency: (2 * Math.PI * f).toFixed(2) + " rad/s",
      wave_type: isLight ? "Electromagnetic" : isSound ? "Sound wave" : "Mechanical wave",
      energy_photon: isLight ? ((6.626e-34 * f) / 1.602e-19).toFixed(4) + " eV" : "N/A (not EM)"
    };
  }
};