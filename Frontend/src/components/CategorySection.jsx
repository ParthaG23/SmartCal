import { motion } from "framer-motion";
import {
  FaCalculator, FaMoneyBillWave, FaHeartbeat,
  FaSquareRootAlt, FaFlask, FaShoppingCart, FaCar,
} from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";

/* ── Category definitions ─────────────────────────────────── */
const CATEGORIES = [
  { name: "All",        icon: <FaCalculator />,    accent: "#6366f1" },
  { name: "Finance",    icon: <FaMoneyBillWave />,  accent: "#6366f1" },
  { name: "Health",     icon: <FaHeartbeat />,      accent: "#ec4899" },
  { name: "Math",       icon: <FaSquareRootAlt />,  accent: "#3b82f6" },
  { name: "Science",    icon: <FaFlask />,           accent: "#a855f7" },
  { name: "Shopping",   icon: <FaShoppingCart />,   accent: "#f97316" },
  { name: "Travel",     icon: <FaCar />,             accent: "#06b6d4" },
  { name: "Converters", icon: <MdSwapHoriz />,       accent: "#10b981" },
  { name: "Personal",   icon: <FaCalculator />,      accent: "#f59e0b" },
];

export default function CategorySection({ category, setCategory }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
      {CATEGORIES.map((cat) => {
        const active = category === cat.name;

        return (
          <motion.button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`
              relative flex items-center gap-2
              px-4 py-2 rounded-xl
              text-[13px] font-semibold
              border transition-all duration-200
              outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${active
                ? "text-white border-transparent shadow-md"
                : `
                  bg-white dark:bg-[#111116]
                  border-gray-200 dark:border-white/8
                  text-gray-500 dark:text-white/45
                  hover:border-gray-300 dark:hover:border-white/15
                  hover:text-gray-700 dark:hover:text-white/70
                `
              }
            `}
            style={
              active
                ? {
                    background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}cc)`,
                    boxShadow:  `0 4px 14px ${cat.accent}40`,
                  }
                : {}
            }
          >
            {/* icon */}
            <span
              className="text-sm leading-none transition-colors duration-200"
              style={{ color: active ? "rgba(255,255,255,0.9)" : cat.accent }}
            >
              {cat.icon}
            </span>

            {/* label */}
            <span className="leading-none">{cat.name}</span>

            {/* active indicator dot */}
            {active && (
              <motion.span
                layoutId="activeDot"
                className="ml-0.5 h-1.5 w-1.5 rounded-full bg-white/60"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
