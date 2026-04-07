import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiSparkles } from "react-icons/hi2";
import {
  FaCalculator,
  FaChartLine,
  FaHeartbeat,
  FaMoneyBillWave,
  FaSquareRootAlt,
  FaCar,
} from "react-icons/fa";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

const QUICK_LINKS = [
  { label: "BMI", slug: "bmi", accent: "#ec4899" },
  { label: "EMI", slug: "emi", accent: "#6366f1" },
  { label: "SIP", slug: "sip", accent: "#6366f1" },
  { label: "GST", slug: "gst", accent: "#6366f1" },
  { label: "BMR", slug: "bmr", accent: "#ec4899" },
  { label: "Quadratic", slug: "quadratic", accent: "#3b82f6" },
  { label: "Ohm's Law", slug: "ohms-law", accent: "#a855f7" },
  { label: "Discount", slug: "discount", accent: "#f97316" },
  { label: "Fuel Cost", slug: "fuelCost", accent: "#06b6d4" },
  { label: "Sleep Cycle", slug: "sleep-cycle", accent: "#f59e0b" },
  { label: "Age", slug: "age", accent: "#f59e0b" },
  { label: "Electricity", slug: "electricity-cost", accent: "#f97316" },
  { label: "Pace", slug: "pace", accent: "#06b6d4" },
  { label: "Macros", slug: "macros", accent: "#ec4899" },
];

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white/80 dark:bg-[#111116]/80 border-gray-200/80 dark:border-white/8 px-4 py-3.5 backdrop-blur-sm shadow-sm">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
        style={{ background: `${accent}18`, color: accent }}
      >
        {icon}{" "}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30">
          {label}
        </p>

        <p className="text-sm font-bold" style={{ color: accent }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function PreviewCard({ icon, name, category, accent, delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex items-center gap-3 rounded-2xl border bg-white dark:bg-[#111116] border-gray-200/80 dark:border-white/8 px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm"
        style={{ background: `${accent}18`, color: accent }}
      >
        {icon}{" "}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-gray-800 dark:text-white/85 truncate">
          {name}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-white/30">
          {category}
        </p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 dark:bg-[#09090b]">
      {/* background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
        linear-gradient(to right, rgba(99,102,241,1) 1px, transparent 1px)
      `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* glow */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, rgba(236,72,153,0.10) 50%, transparent 100%)",
        }}
      />

      {/* FULL WIDTH CONTAINER */}
      <div className="relative w-full px-6 md:px-10 xl:px-20 py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div className="flex flex-col items-start">
            <motion.div {...fadeUp(0)} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400">
                <HiSparkles className="text-xs" />
                Smart Calculations · Instant Insights · Zero Effort
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold tracking-tight leading-[1.06] text-gray-900 dark:text-white/95 mb-5"
            >
              All-in-One{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Calculator
              </span>
              <br />
              Platform
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="max-w-xl text-base sm:text-lg leading-relaxed text-gray-500 dark:text-white/45 mb-8"
            >
              Finance, health, math and science calculators — all in one place.
              Get instant results with visual charts and unit conversions.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#6366f1bb)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                Explore Calculators
                <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white/70"
              >
                Browse Categories
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.32)} className="flex flex-wrap gap-2">
              {QUICK_LINKS.map(({ label, slug, accent }) => (
                <Link
                  key={slug}
                  to={`/calculator/${slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 border-gray-200 bg-white text-gray-600 hover:shadow-md hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:border-white/20"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.color = accent;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${accent}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                  {label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex flex-col gap-5">
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<FaCalculator />}
                label="Calculators"
                value="70+ Tools"
                accent="#6366f1"
              />
              <StatCard
                icon={<FaChartLine />}
                label="Categories"
                value="7 Types"
                accent="#ec4899"
              />
              <StatCard
                icon={<FaHeartbeat />}
                label="Results"
                value="Instant"
                accent="#10b981"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <PreviewCard
                icon={<FaHeartbeat />}
                name="BMI"
                category="Health"
                accent="#ec4899"
                delay={0.28}
              />
              <PreviewCard
                icon={<FaMoneyBillWave />}
                name="EMI"
                category="Finance"
                accent="#6366f1"
                delay={0.34}
              />
              <PreviewCard
                icon={<FaMoneyBillWave />}
                name="GST"
                category="Finance"
                accent="#6366f1"
                delay={0.4}
              />
              <PreviewCard
                icon={<FaSquareRootAlt />}
                name="Compound Interest"
                category="Finance"
                accent="#6366f1"
                delay={0.46}
              />
              <PreviewCard
                icon={<FaCar />}
                name="Fuel Cost"
                category="Travel"
                accent="#06b6d4"
                delay={0.52}
              />
              <PreviewCard
                icon={<FaCalculator />}
                name="Discount"
                category="Shopping"
                accent="#f97316"
                delay={0.58}
              />
            </div>

            <motion.p
              {...fadeUp(0.65)}
              className="text-center text-xs text-gray-400 dark:text-white/25"
            >
              All calculators are free, no account required
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
