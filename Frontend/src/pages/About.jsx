import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalculator, FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FiZap, FiShield, FiTrendingUp,
  FiSmartphone, FiMoon, FiCode, FiHeart,
  FiUsers, FiLock, FiGlobe,
} from "react-icons/fi";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";

/* ── Animation helpers ─────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Feature card data ── */
const FEATURES = [
  {
    icon: FiZap, title: "Lightning Fast",
    desc: "Instant calculations with zero server roundtrips. Everything runs locally in your browser.",
    accent: "#6366f1",
  },
  {
    icon: FiTrendingUp, title: "Smart Visualizations",
    desc: "Dynamic Recharts-powered graphs — bar charts, pie charts, and gauges generated automatically.",
    accent: "#ec4899",
  },
  {
    icon: FiShield, title: "100% Private",
    desc: "No data ever leaves your device. No accounts, no cookies, no tracking. Your numbers stay yours.",
    accent: "#10b981",
  },
  {
    icon: FiSmartphone, title: "Installable PWA",
    desc: "Add CalcVision to your home screen on any device. Works offline like a native app.",
    accent: "#f59e0b",
  },
  {
    icon: FiMoon, title: "Dark & Light Mode",
    desc: "Seamlessly adapts to your system preference. Easy on the eyes — day or night.",
    accent: "#a855f7",
  },
  {
    icon: FiCode, title: "Open Source",
    desc: "Built with modern tech. Clean, extensible code — contributions are welcome.",
    accent: "#06b6d4",
  },
];

/* ── Tech stack ── */
const STACK = [
  { label: "React 18",     color: "#61dafb", icon: "⚛️" },
  { label: "Vite 6",       color: "#646cff", icon: "⚡" },
  { label: "Tailwind CSS", color: "#38bdf8", icon: "🎨" },
  { label: "Framer Motion", color: "#a78bfa", icon: "✨" },
  { label: "Recharts",     color: "#8884d8", icon: "📊" },
  { label: "PWA",          color: "#10b981", icon: "📱" },
];

/* ── Stats ── */
const STATS = [
  { value: "70+", label: "Calculators", accent: "#6366f1" },
  { value: "7",   label: "Categories",  accent: "#ec4899" },
  { value: "∞",   label: "Calculations", accent: "#a855f7" },
  { value: "0",   label: "Data Collected", accent: "#10b981" },
];

/* ── Categories ── */
const CATEGORIES = [
  { name: "Finance",  count: 10, icon: "💰", accent: "#6366f1" },
  { name: "Health",   count: 10, icon: "❤️", accent: "#ec4899" },
  { name: "Math",     count: 10, icon: "📐", accent: "#3b82f6" },
  { name: "Science",  count: 10, icon: "🔬", accent: "#a855f7" },
  { name: "Shopping", count: 9,  icon: "🛒", accent: "#f97316" },
  { name: "Personal", count: 11, icon: "👤", accent: "#f59e0b" },
  { name: "Travel",   count: 10, icon: "✈️", accent: "#06b6d4" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300 overflow-hidden">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(to right, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 pb-28">

        {/* ══════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0)} className="text-center mb-20">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
              bg-indigo-50 dark:bg-indigo-500/10
              border border-indigo-200/80 dark:border-indigo-500/20">
            <HiSparkles className="text-indigo-500 dark:text-indigo-400" size={14} />
            <span className="text-xs font-bold uppercase tracking-widest
              text-indigo-600 dark:text-indigo-400">
              About CalcVision
            </span>
          </motion.div>

          {/* Animated icon */}
          <motion.div {...fadeUp(0.08)} className="flex justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #ec4899)",
                  boxShadow: "0 0 60px rgba(99,102,241,0.25), 0 0 120px rgba(236,72,153,0.1)",
                }}>
                <FaCalculator className="text-white text-2xl" />
              </div>
              {/* glow ring */}
              <motion.div
                className="absolute -inset-3 rounded-3xl border-2 border-indigo-400/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1 {...fadeUp(0.12)}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-5
              text-gray-900 dark:text-white leading-[0.95]">
            Calc
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" }}>
              Vision
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p {...fadeUp(0.16)}
            className="text-xl md:text-2xl font-semibold mb-6
              text-gray-400 dark:text-white/35 tracking-tight">
            Calculate smarter. See clearer.
          </motion.p>

          <motion.p {...fadeUp(0.2)}
            className="max-w-xl mx-auto text-[15px] leading-relaxed
              text-gray-500 dark:text-white/40 mb-8">
            CalcVision is a modern, privacy-first calculator platform with 70+ tools
            spanning finance, health, math, science and more — all running instantly
            in your browser with beautiful visual insights.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.24)} className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg,#6366f1,#6366f1cc)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
              }}
            >
              Explore Calculators
              <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/ParthaG23/SmartCal"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:shadow-md
                border-gray-200 bg-white text-gray-700
                dark:border-white/10 dark:bg-white/5 dark:text-white/70
                dark:hover:border-white/20"
            >
              <FaGithub /> View Source
            </a>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20">
          {STATS.map(({ value, label, accent }, i) => (
            <motion.div
              key={label}
              {...fadeUp(0.05 + i * 0.06)}
              className="group flex flex-col items-center justify-center py-7 px-4 rounded-2xl
                border text-center cursor-default
                bg-white/80 dark:bg-white/[0.03]
                border-gray-200/80 dark:border-white/[0.06]
                hover:border-gray-300 dark:hover:border-white/[0.12]
                hover:-translate-y-1 hover:shadow-lg
                dark:hover:shadow-[0_8px_30px_-10px_rgba(99,102,241,0.15)]
                transition-all duration-250 backdrop-blur-sm"
            >
              <span className="text-4xl sm:text-5xl font-black tracking-tighter mb-1.5"
                style={{ color: accent }}>
                {value}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest
                text-gray-400 dark:text-white/25">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="text-center mb-12">
            <motion.p {...fadeUp(0.05)}
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3
                text-indigo-500 dark:text-indigo-400">
              Why CalcVision
            </motion.p>
            <motion.h2 {...fadeUp(0.08)}
              className="text-3xl md:text-4xl font-black tracking-tight
                text-gray-900 dark:text-white">
              Built for real people
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div
                key={title}
                {...fadeUp(0.04 + i * 0.06)}
                className="group relative p-6 rounded-2xl border overflow-hidden cursor-default
                  bg-white/80 dark:bg-white/[0.02]
                  border-gray-200/80 dark:border-white/[0.06]
                  hover:-translate-y-1.5
                  transition-all duration-300"
                style={{
                  ["--accent"]: accent,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${accent}40`;
                  e.currentTarget.style.boxShadow = `0 12px 40px -12px ${accent}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${accent}08, transparent 70%)` }} />

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4
                    transition-colors duration-200"
                    style={{
                      background: `${accent}10`,
                    }}>
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="font-bold text-[15px] mb-2 tracking-tight
                    text-gray-900 dark:text-white/90">
                    {title}
                  </h3>
                  <p className="text-[13px] leading-relaxed
                    text-gray-500 dark:text-white/40">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            CATEGORIES SHOWCASE
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="text-center mb-12">
            <motion.p {...fadeUp(0.05)}
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3
                text-pink-500 dark:text-pink-400">
              Categories
            </motion.p>
            <motion.h2 {...fadeUp(0.08)}
              className="text-3xl md:text-4xl font-black tracking-tight
                text-gray-900 dark:text-white">
              7 domains, one platform
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map(({ name, count, icon, accent }, i) => (
              <motion.div key={name} {...fadeUp(0.04 + i * 0.05)}>
                <Link
                  to={`/categories?category=${name}`}
                  className="group flex items-center gap-3 p-4 rounded-2xl border
                    transition-all duration-250 cursor-pointer
                    bg-white/80 dark:bg-white/[0.02]
                    border-gray-200/80 dark:border-white/[0.06]
                    hover:-translate-y-1 hover:shadow-lg
                    dark:hover:shadow-[0_8px_30px_-10px_rgba(99,102,241,0.12)]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white/85 truncate">
                      {name}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: accent }}>
                      {count} calculators
                    </p>
                  </div>
                  <HiArrowRight className="ml-auto text-gray-300 dark:text-white/15 group-hover:text-gray-500 dark:group-hover:text-white/40 transition-colors text-sm shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="rounded-2xl p-6 sm:p-8 border
            bg-white/80 dark:bg-white/[0.02]
            border-gray-200/80 dark:border-white/[0.06]
            backdrop-blur-sm">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.1)" }}>
                <FiCode size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white/90">Built with</p>
                <p className="text-[11px] text-gray-400 dark:text-white/30">Modern, production-grade stack</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STACK.map(({ label, color, icon }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(0.04 + i * 0.05)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border
                    bg-gray-50/80 dark:bg-white/[0.03]
                    border-gray-200/80 dark:border-white/[0.06]
                    hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-200 cursor-default"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${color}50`;
                    e.currentTarget.style.boxShadow = `0 4px 15px -5px ${color}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <span className="text-base">{icon}</span>
                  <span className="text-[13px] font-bold" style={{ color }}>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            PRIVACY & TRUST
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: FiLock, title: "No Data Storage", desc: "Zero databases. Everything runs client-side in your browser.", accent: "#10b981" },
              { icon: FiUsers, title: "No Accounts", desc: "No sign-up, no login, no cookies. Just open and calculate.", accent: "#6366f1" },
              { icon: FiGlobe, title: "Works Offline", desc: "PWA-enabled. Install and use without internet after first visit.", accent: "#f59e0b" },
            ].map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div
                key={title}
                {...fadeUp(0.04 + i * 0.06)}
                className="p-6 rounded-2xl border text-center
                  bg-white/80 dark:bg-white/[0.02]
                  border-gray-200/80 dark:border-white/[0.06]
                  hover:-translate-y-1 transition-all duration-250"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${accent}10` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white/85">{title}</h3>
                <p className="text-[13px] text-gray-500 dark:text-white/35 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            MISSION CTA CARD
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)}>
          <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            }}>

            {/* Decorative elements */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.03]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-5">
                <FiHeart size={14} className="text-pink-200" />
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.15em]">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
                Making calculations<br />
                <span className="text-white/60">accessible to everyone</span>
              </h2>

              <p className="max-w-lg mx-auto text-white/55 text-[14px] leading-relaxed mb-8">
                We believe powerful tools shouldn't be complicated. CalcVision brings
                70+ calculators across finance, health, math, science and more into one
                intuitive platform — free, private, and beautifully designed.
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <FaCalculator size={14} className="text-white" />
                  </div>
                  <span className="text-white font-bold text-lg tracking-tight">CalcVision</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-2">
                  <a href="https://github.com/ParthaG23" target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                    <FaGithub className="text-white text-sm" />
                  </a>
                  <a href="https://www.linkedin.com/in/partha-gayen" target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                    <FaLinkedin className="text-white text-sm" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}