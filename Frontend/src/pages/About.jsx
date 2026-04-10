import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FiZap, FiHeart, FiArrowRight,
} from "react-icons/fi";
import {
  RiSparkling2Line,
  RiCalculatorLine,
  RiBarChartBoxLine,
  RiShieldCheckLine,
  RiInstallLine,
  RiMoonClearLine,
  RiCodeSSlashLine,
  RiBankLine,
  RiHeartPulseLine,
  RiMicroscopeLine,
  RiShoppingCart2Line,
  RiUser3Line,
  RiPlaneLine,
  RiReactjsLine,
  RiSpeedLine,
  RiPaletteLine,
  RiCpuLine,
  RiPieChartLine,
  RiLockLine,
  RiTeamLine,
  RiWifiOffLine,
  RiStackLine,
  RiCellphoneLine,
  RiGithubLine,
  RiLinkedinLine,
} from "react-icons/ri";
import { TbMathSymbols } from "react-icons/tb";

/* ── Animation helpers ─────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Feature card data ── */
const FEATURES = [
  { icon: FiZap,            title: "Lightning Fast",       desc: "Instant calculations with zero server roundtrips. Everything runs locally in your browser.",                              accent: "#6366f1" },
  { icon: RiBarChartBoxLine, title: "Smart Visualizations", desc: "Dynamic Recharts-powered graphs — bar charts, pie charts, and gauges generated automatically.",                           accent: "#ec4899" },
  { icon: RiShieldCheckLine, title: "100% Private",         desc: "No data ever leaves your device. No accounts, no cookies, no tracking. Your numbers stay yours.",                        accent: "#10b981" },
  { icon: RiCellphoneLine,  title: "Installable PWA",      desc: "Add CalcVision to your home screen on any device. Works offline like a native app.",                                      accent: "#f59e0b" },
  { icon: RiMoonClearLine,  title: "Dark & Light Mode",    desc: "Seamlessly adapts to your system preference. Easy on the eyes — day or night.",                                           accent: "#a855f7" },
  { icon: RiCodeSSlashLine, title: "Open Source",          desc: "Built with modern tech. Clean, extensible code — contributions are welcome.",                                             accent: "#06b6d4" },
];

/* ── Tech stack ── */
const STACK = [
  { label: "React 18",      color: "#61dafb", Icon: RiReactjsLine  },
  { label: "Vite 6",        color: "#646cff", Icon: RiSpeedLine     },
  { label: "Tailwind CSS",  color: "#38bdf8", Icon: RiPaletteLine   },
  { label: "Framer Motion", color: "#a78bfa", Icon: RiCpuLine       },
  { label: "Recharts",      color: "#8884d8", Icon: RiPieChartLine  },
  { label: "PWA",           color: "#10b981", Icon: RiInstallLine   },
];

/* ── Stats ── */
const STATS = [
  { value: "70+", label: "Calculators",    accent: "#6366f1" },
  { value: "7",   label: "Categories",     accent: "#ec4899" },
  { value: "∞",   label: "Calculations",   accent: "#a855f7" },
  { value: "0",   label: "Data Collected", accent: "#10b981" },
];

/* ── Categories ── */
const CATEGORIES = [
  { name: "Finance",  count: 10, Icon: RiBankLine,          accent: "#6366f1" },
  { name: "Health",   count: 10, Icon: RiHeartPulseLine,    accent: "#ec4899" },
  { name: "Math",     count: 10, Icon: TbMathSymbols,       accent: "#3b82f6" },
  { name: "Science",  count: 10, Icon: RiMicroscopeLine,    accent: "#a855f7" },
  { name: "Shopping", count: 9,  Icon: RiShoppingCart2Line, accent: "#f97316" },
  { name: "Personal", count: 11, Icon: RiUser3Line,         accent: "#f59e0b" },
  { name: "Travel",   count: 10, Icon: RiPlaneLine,         accent: "#06b6d4" },
];

/* ── Social links ── */
const SOCIALS = [
  { href: "https://github.com/ParthaG23",                Icon: RiGithubLine,   label: "GitHub"   },
  { href: "https://www.linkedin.com/in/partha-gayen",   Icon: RiLinkedinLine, label: "LinkedIn" },
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
          <motion.div {...fadeUp(0.05)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
              bg-indigo-50 dark:bg-indigo-500/10
              border border-indigo-200/80 dark:border-indigo-500/20">
            <RiSparkling2Line className="text-indigo-500 dark:text-indigo-400" size={14} />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              About CalcVision
            </span>
          </motion.div>

          <motion.div {...fadeUp(0.08)} className="flex justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  boxShadow: "0 0 60px rgba(99,102,241,0.25), 0 0 120px rgba(236,72,153,0.1)",
                }}>
                <img 
                  src="/logo.png" 
                  alt="CalcVision Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -inset-3 rounded-3xl border-2 border-indigo-400/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          <motion.h1 {...fadeUp(0.12)}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-5 text-gray-900 dark:text-white leading-[0.95]">
            Calc
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" }}>
              Vision
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)}
            className="text-xl md:text-2xl font-semibold mb-6 text-gray-400 dark:text-white/35 tracking-tight">
            Calculate smarter. See clearer.
          </motion.p>

          <motion.p {...fadeUp(0.2)}
            className="max-w-xl mx-auto text-[15px] leading-relaxed text-gray-500 dark:text-white/40 mb-8">
            CalcVision is a modern, privacy-first calculator platform with 70+ tools
            spanning finance, health, math, science and more — all running instantly
            in your browser with beautiful visual insights.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#6366f1cc)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
            >
              Explore Calculators
              <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/ParthaG23/SmartCal"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:shadow-md border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20"
            >
              <FaGithub /> View Source
            </a>
          </motion.div>
        </motion.div>

        {/* STATS */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20">
          {STATS.map(({ value, label, accent }, i) => (
            <motion.div key={label} {...fadeUp(0.05 + i * 0.06)}
              className="group flex flex-col items-center justify-center py-7 px-4 rounded-2xl border text-center cursor-default bg-white/80 dark:bg-white/[0.03] border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-lg transition-all duration-250 backdrop-blur-sm"
            >
              <span className="text-4xl sm:text-5xl font-black tracking-tighter mb-1.5" style={{ color: accent }}>{value}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* FEATURES */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="text-center mb-12">
            <motion.p {...fadeUp(0.05)} className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-indigo-500 dark:text-indigo-400">Why CalcVision</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Built for real people</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div key={title} {...fadeUp(0.04 + i * 0.06)}
                className="group relative p-6 rounded-2xl border overflow-hidden cursor-default bg-white/80 dark:bg-white/[0.02] border-gray-200/80 dark:border-white/[0.06] hover:-translate-y-1.5 transition-all duration-300"
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; e.currentTarget.style.boxShadow = `0 12px 40px -12px ${accent}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${accent}08, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${accent}10` }}>
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="font-bold text-[15px] mb-2 tracking-tight text-gray-900 dark:text-white/90">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-gray-500 dark:text-white/40">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CATEGORIES */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="text-center mb-12">
            <motion.p {...fadeUp(0.05)} className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-pink-500 dark:text-pink-400">Categories</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">7 domains, one platform</motion.h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map(({ name, count, Icon, accent }, i) => (
              <motion.div key={name} {...fadeUp(0.04 + i * 0.05)}>
                <Link
                  to={`/categories?category=${name}`}
                  className="group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-250 cursor-pointer bg-white/80 dark:bg-white/[0.02] border-gray-200/80 dark:border-white/[0.06] hover:-translate-y-1 hover:shadow-lg"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}15` }}>
                    <Icon size={17} style={{ color: accent }} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white/85 truncate">{name}</p>
                    <p className="text-[11px] font-medium" style={{ color: accent }}>{count} calculators</p>
                  </div>
                  <FiArrowRight size={13} className="ml-auto text-gray-300 dark:text-white/15 group-hover:text-gray-500 dark:group-hover:text-white/40 transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TECH STACK */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="rounded-2xl p-6 sm:p-8 border bg-white/80 dark:bg-white/[0.02] border-gray-200/80 dark:border-white/[0.06] backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
                <RiStackLine size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white/90">Built with</p>
                <p className="text-[11px] text-gray-400 dark:text-white/30">Modern, production-grade stack</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STACK.map(({ label, color, Icon }, i) => (
                <motion.div key={label} {...fadeUp(0.04 + i * 0.05)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-gray-50/80 dark:bg-white/[0.03] border-gray-200/80 dark:border-white/[0.06] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 4px 15px -5px ${color}25`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  <Icon size={15} style={{ color }} />
                  <span className="text-[13px] font-bold" style={{ color }}>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PRIVACY */}
        <motion.div {...fadeUp(0.05)} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { Icon: RiLockLine,    title: "No Data Storage", desc: "Zero databases. Everything runs client-side in your browser.",     accent: "#10b981" },
              { Icon: RiTeamLine,    title: "No Accounts",     desc: "No sign-up, no login, no cookies. Just open and calculate.",       accent: "#6366f1" },
              { Icon: RiWifiOffLine, title: "Works Offline",   desc: "PWA-enabled. Install and use without internet after first visit.", accent: "#f59e0b" },
            ].map(({ Icon, title, desc, accent }, i) => (
              <motion.div key={title} {...fadeUp(0.04 + i * 0.06)}
                className="p-6 rounded-2xl border text-center bg-white/80 dark:bg-white/[0.02] border-gray-200/80 dark:border-white/[0.06] hover:-translate-y-1 transition-all duration-250"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${accent}10` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white/85">{title}</h3>
                <p className="text-[13px] text-gray-500 dark:text-white/35 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            MISSION CTA — dark premium redesign
        ══════════════════════════════════════ */}
        <motion.div {...fadeUp(0.05)}>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: "#000000", border: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            {/* Subtle corner glows */}
            <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(236,72,153,0.4), transparent)" }} />

            {/* Faint grid inside card */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />

            <div className="relative z-10 px-8 sm:px-16 py-14 sm:py-20 text-center">

              {/* Mission pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                <FiHeart size={12} style={{ color: "#ec4899" }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  Our Mission
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.05] mb-5">
                <span className="text-white">Making calculations</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)" }}
                >
                  accessible to everyone
                </span>
              </h2>

              {/* Divider line */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
                <div className="w-4 h-4 rounded-md overflow-hidden opacity-50">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
              </div>

              {/* Body */}
              <p className="max-w-lg mx-auto text-[14px] leading-[1.85] mb-10"
                style={{ color: "rgba(255,255,255,0.38)" }}>
                We believe powerful tools shouldn't be complicated. CalcVision brings
                70+ calculators across finance, health, math, science and more into one
                intuitive platform — free, private, and beautifully designed.
              </p>

              {/* Brand + socials row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

                {/* Brand chip */}
                <div
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="CalcVision Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-[15px] tracking-tight" style={{ color: "rgba(255,255,255,0.85)" }}>
                    CalcVision
                  </span>
                </div>

                {/* Dot separator */}
                <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "20px" }}>·</span>

                {/* Social links */}
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ href, Icon, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.45)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      }}
                    >
                      <Icon size={15} />
                      <span className="text-[12px] font-semibold">{label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}