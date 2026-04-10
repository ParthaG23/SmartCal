import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCalculatorLine, RiSparkling2Line, RiSafeLine, RiCompassLine, RiShieldFlashLine } from "react-icons/ri";

/* ── Floating particle config ───────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1.5,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
}));

/* ── Math & Tech symbols for floating animation ────────── */
const SYMBOLS = ["∑", "π", "∫", "÷", "×", "√", "%", "±", "∞", "Δ", "λ", "Ω", "θ", "φ", "δ", "μ", "σ", "β"];
const ICONS = [RiCalculatorLine, RiSparkling2Line, RiSafeLine, RiCompassLine, RiShieldFlashLine];

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState(0); // 0=ring, 1=logo, 2=text, 3=exit

  useEffect(() => {
    // Remove the native HTML preloader immediately
    const preloader = document.getElementById("splash-preloader");
    if (preloader) preloader.classList.add("hide");

    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => onFinish?.(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: "#09090b" }}
        >
          {/* Background gradient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.06) 40%, transparent 80%)",
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(to right, rgba(99,102,241,1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.id % 2 === 0
                  ? "rgba(99,102,241,0.4)"
                  : "rgba(236,72,153,0.3)",
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Floating symbols & icons */}
          {SYMBOLS.concat(ICONS).map((Item, i) => (
            <motion.span
              key={i}
              className="absolute text-white/[0.04] font-bold select-none pointer-events-none"
              style={{
                left: `${8 + (i * 7.5) % 85}%`,
                top: `${10 + (i * 13) % 75}%`,
                fontSize: typeof Item === "string" ? `${18 + i * 2}px` : "24px",
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, i % 2 === 0 ? 15 : -15, 0],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              {typeof Item === "string" ? Item : <Item />}
            </motion.span>
          ))}

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-6 z-10">

            {/* Animated ring / logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outer rotating ring */}
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "rgba(99,102,241,0.5)",
                  borderRightColor: "rgba(236,72,153,0.3)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Second rotating ring (opposite) */}
              <motion.div
                className="absolute -inset-7 rounded-full"
                style={{
                  border: "1px solid transparent",
                  borderBottomColor: "rgba(99,102,241,0.2)",
                  borderLeftColor: "rgba(236,72,153,0.15)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon container */}
              <motion.div
                className="flex items-center justify-center rounded-2xl overflow-hidden"
                style={{
                  width: 72,
                  height: 72,
                  boxShadow: "0 0 40px rgba(99,102,241,0.2), 0 0 80px rgba(236,72,153,0.1)",
                }}
                animate={phase >= 1 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="/logo.png" 
                  alt="CalcVision Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-2"
                >
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    <span
                      style={{
                        background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      CalcVision
                    </span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-sm text-white/30 font-medium tracking-wide">
                    70+ Smart Calculators · Instant Results
                  </p>

                  {/* Loading bar */}
                  <div className="w-40 h-[3px] rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #6366f1, #ec4899, #6366f1)",
                        backgroundSize: "200% 100%",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
