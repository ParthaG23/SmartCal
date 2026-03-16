import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalculator, FaMoneyBillWave, FaHeartbeat,
  FaSquareRootAlt, FaFlask, FaShoppingCart, FaCar,
} from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";

/* ── Per-category design tokens ──────────────────────────── */
const CATEGORY = {
  Finance:   { icon:<FaMoneyBillWave/>,  accent:"#6366f1", light:"#eef2ff", dark:"rgba(99,102,241,0.15)",  label:"indigo"  },
  Health:    { icon:<FaHeartbeat/>,       accent:"#ec4899", light:"#fdf2f8", dark:"rgba(236,72,153,0.15)",  label:"pink"    },
  Math:      { icon:<FaSquareRootAlt/>,   accent:"#3b82f6", light:"#eff6ff", dark:"rgba(59,130,246,0.15)",  label:"blue"    },
  Science:   { icon:<FaFlask/>,           accent:"#a855f7", light:"#faf5ff", dark:"rgba(168,85,247,0.15)",  label:"purple"  },
  Shopping:  { icon:<FaShoppingCart/>,    accent:"#f97316", light:"#fff7ed", dark:"rgba(249,115,22,0.15)",  label:"orange"  },
  Travel:    { icon:<FaCar/>,             accent:"#06b6d4", light:"#ecfeff", dark:"rgba(6,182,212,0.15)",   label:"cyan"    },
  Personal:  { icon:<FaCalculator/>,      accent:"#f59e0b", light:"#fffbeb", dark:"rgba(245,158,11,0.15)",  label:"amber"   },
  Converters:{ icon:<MdSwapHoriz/>,       accent:"#10b981", light:"#ecfdf5", dark:"rgba(16,185,129,0.15)",  label:"emerald" },
  General:   { icon:<FaCalculator/>,      accent:"#64748b", light:"#f8fafc", dark:"rgba(100,116,139,0.15)", label:"slate"   },
};

export default function CalculatorCard({ calculator }) {
  if (!calculator) return null;

  const cat    = CATEGORY[calculator.category] ?? CATEGORY.General;
  const accent = cat.accent;

  return (
    <Link to={`/calculator/${calculator.slug}`} className="block group focus:outline-none">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="
          relative h-full overflow-hidden rounded-2xl
          border border-gray-200/80 bg-white
          shadow-sm hover:shadow-lg
          transition-shadow duration-300
          dark:border-white/8 dark:bg-[#111116]
        "
      >
        {/* Subtle top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)` }}
        />

        {/* Soft background glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{ background: `radial-gradient(ellipse 80% 60% at 20% 0%, ${accent}10, transparent 70%)` }}
        />

        <div className="relative p-5 flex flex-col gap-4">

          {/* Top row: icon + popular badge */}
          <div className="flex items-start justify-between">

            {/* Icon box */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${accent}18`, color: accent }}
            >
              {cat.icon}
            </div>

            {/* Popular badge */}
            {calculator.popular && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25">
                <HiSparkles className="text-[10px]" />
                Popular
              </span>
            )}
          </div>

          {/* Name */}
          <div>
            <h3 className="text-[15px] font-semibold leading-snug text-gray-900 dark:text-white/90 group-hover:text-[var(--acc)] transition-colors duration-200"
              style={{ "--acc": accent }}>
              {calculator.name}
            </h3>

            {calculator.description && (
              <p className="mt-1 text-[12px] leading-relaxed text-gray-400 dark:text-white/35 line-clamp-2">
                {calculator.description}
              </p>
            )}
          </div>

          {/* Bottom row: category pill + arrow */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border"
              style={{
                background: `${accent}12`,
                color:      accent,
                borderColor:`${accent}30`,
              }}
            >
              {calculator.category}
            </span>

            <span
              className="flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200"
              style={{ color: accent }}
            >
              Open <HiArrowRight className="text-sm" />
            </span>
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
