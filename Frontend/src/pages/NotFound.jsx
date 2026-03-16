import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

const particles = Array.from({ length: 18 });

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#09090b]">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
          linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
          linear-gradient(to right, rgba(99,102,241,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Glow gradient */}
      <div
        className="absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.25) 0%, rgba(236,72,153,0.15) 45%, transparent 70%)"
        }}
      />

      {/* Floating particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -40, -80],
            x: [0, (Math.random() - 0.5) * 40]
          }}
          transition={{
            duration: 6 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400/40"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-20px"
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative text-center px-6">

        {/* Animated 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[90px] sm:text-[120px] font-bold tracking-tight"
        >
          <span
            style={{
              background:
                "linear-gradient(135deg,#6366f1 0%,#ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            404
          </span>
        </motion.h1>

        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl"
          >
            🧭
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-3"
        >
          Lost in calculation space
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8"
        >
          The page you're looking for doesn't exist or was moved.
          Let's get you back to SmartCalc so you can continue calculating.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg,#6366f1,#6366f1bb)",
              boxShadow: "0 6px 25px rgba(99,102,241,0.35)"
            }}
          >
            <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
}