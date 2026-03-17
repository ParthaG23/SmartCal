import { motion } from "framer-motion";
import { FaCalculator } from "react-icons/fa";
import {
  FiZap, FiShield, FiTrendingUp, FiClock,
  FiSmartphone, FiMoon, FiCode, FiHeart,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

/* ── Fade-up animation variant ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Feature card data ── */
const FEATURES = [
  { icon: FiZap,         title: "Lightning Fast",     desc: "Instant calculations with real-time results. No delays, no loading." },
  { icon: FiTrendingUp,  title: "Smart Insights",     desc: "Visual charts and breakdowns that make numbers easy to understand." },
  { icon: FiClock,       title: "Full History",        desc: "Every calculation saved automatically. Review anytime, anywhere." },
  { icon: FiShield,      title: "Secure & Private",   desc: "Your data is yours. Encrypted, protected, never shared." },
  { icon: FiSmartphone,  title: "Works Everywhere",   desc: "Responsive on any device — desktop, tablet, or mobile." },
  { icon: FiMoon,        title: "Dark & Light Mode",  desc: "Easy on the eyes day or night with seamless theme switching." },
];

/* ── Stack data ── */
const STACK = [
  { label: "React",    color: "#61dafb" },
  { label: "Node.js",  color: "#8cc84b" },
  { label: "MongoDB",  color: "#47a248" },
  { label: "Firebase", color: "#ffca28" },
  { label: "Tailwind", color: "#38bdf8" },
  { label: "Framer",   color: "#a78bfa" },
];

/* ── Stats ── */
const STATS = [
  { value: "15+", label: "Calculators" },
  { value: "5",   label: "Categories" },
  { value: "∞",   label: "Calculations" },
  { value: "100%", label: "Free" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300 overflow-hidden">

      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 dark:opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-10 dark:opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 dark:opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-20 pb-32">

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0)} className="text-center mb-20">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
              bg-indigo-50 dark:bg-indigo-500/10
              border border-indigo-200 dark:border-indigo-500/20">
            <HiSparkles className="text-indigo-500" size={14} />
            <span className="text-xs font-bold uppercase tracking-widest
              text-indigo-600 dark:text-indigo-400">
              About CalcVision
            </span>
          </motion.div>

         

          {/* Title */}
          <motion.h1 {...fadeUp(0.15)}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-4
              text-gray-900 dark:text-white leading-none">
            Calc
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              Vision
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p {...fadeUp(0.2)}
            className="text-xl md:text-2xl font-medium mb-5
              text-gray-400 dark:text-white/40 tracking-tight">
            Calculate smarter. See clearer.
          </motion.p>

          <motion.p {...fadeUp(0.25)}
            className="max-w-xl mx-auto text-base leading-relaxed
              text-gray-500 dark:text-white/45">
            CalcVision is a modern all-in-one calculator platform built for everyone —
            from students and professionals to everyday users who want fast, visual,
            and accurate calculations in one beautiful place.
          </motion.p>
        </motion.div>

        {/* ══════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.1)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              {...fadeUp(0.1 + i * 0.05)}
              className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl
                border text-center
                bg-white dark:bg-white/3
                border-gray-200 dark:border-white/8
                hover:border-indigo-300 dark:hover:border-indigo-500/30
                hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-indigo-500/10
                transition-all duration-200"
            >
              <span className="text-4xl font-black tracking-tighter mb-1
                bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                {value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest
                text-gray-400 dark:text-white/30">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.1)} className="mb-20">
          <div className="text-center mb-10">
            <motion.p {...fadeUp(0.05)}
              className="text-xs font-bold uppercase tracking-widest mb-2
                text-indigo-500 dark:text-indigo-400">
              What we offer
            </motion.p>
            <motion.h2 {...fadeUp(0.1)}
              className="text-3xl md:text-4xl font-black tracking-tight
                text-gray-900 dark:text-white">
              Built for real people
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(0.05 + i * 0.06)}
                className="group relative p-6 rounded-2xl border overflow-hidden
                  bg-white dark:bg-white/3
                  border-gray-200 dark:border-white/8
                  hover:border-indigo-300 dark:hover:border-indigo-500/25
                  hover:shadow-xl dark:hover:shadow-indigo-500/10
                  hover:-translate-y-1
                  transition-all duration-250"
              >
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.06), transparent 60%)" }} />

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4
                    bg-indigo-50 dark:bg-indigo-500/10
                    group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/15
                    transition-colors duration-200">
                    <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-sm mb-2 tracking-tight
                    text-gray-900 dark:text-white/90">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed
                    text-gray-500 dark:text-white/40">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.1)} className="mb-20">
          <div className="rounded-3xl p-8 border
            bg-white dark:bg-white/3
            border-gray-200 dark:border-white/8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center
                bg-indigo-50 dark:bg-indigo-500/10">
                <FiCode size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white/90">Built with</p>
                <p className="text-xs text-gray-400 dark:text-white/30">Modern, production-grade stack</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {STACK.map(({ label, color }, i) => (
                <motion.span
                  key={label}
                  {...fadeUp(0.05 + i * 0.04)}
                  className="px-4 py-2 rounded-xl text-sm font-bold border
                    bg-gray-50 dark:bg-white/5
                    border-gray-200 dark:border-white/10
                    hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-150 cursor-default"
                  style={{ color }}
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            MISSION CARD
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.1)}>
          <div className="relative rounded-3xl overflow-hidden p-10 text-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}>

            {/* decorative circles */}
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <FiHeart size={16} className="text-pink-300" />
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
                Making calculations<br />
                <span className="text-white/70">accessible to everyone</span>
              </h2>

              <p className="max-w-lg mx-auto text-white/65 text-sm leading-relaxed mb-8">
                We believe powerful tools shouldn't be complicated. CalcVision brings
                together finance, health, math and more into one intuitive platform —
                free, fast, and beautifully designed for everyone.
              </p>

              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <FaCalculator size={14} className="text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">CalcVision</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}