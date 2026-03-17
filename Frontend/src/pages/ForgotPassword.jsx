import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiMail, FiAlertCircle,
  FiArrowLeft, FiCheckCircle, FiArrowRight,
} from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import { sendFirebasePasswordReset } from "../config/firebase";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [focus,   setFocus]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendFirebasePasswordReset(email);
      setSuccess(true);
    } catch (err) {
      /* Firebase error codes */
      const code = err?.code;
      if (code === "auth/user-not-found") {
        /* Still show success — prevents user enumeration */
        setSuccess(true);
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gray-50 dark:bg-[#09090b] px-4 transition-colors duration-300">

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border shadow-2xl overflow-hidden
          border-gray-200 dark:border-white/10
          bg-white dark:bg-[#111116]">

          {/* gradient top bar */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

          <div className="p-8">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-indigo-600 to-purple-600
                shadow-md shadow-indigo-500/25">
                <FaCalculator size={16} className="text-white" />
              </div>
              <span className="font-bold tracking-tight
                text-gray-900 dark:text-white">CalcVision</span>
            </div>

            <AnimatePresence mode="wait">

              {/* ── Success ── */}
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-5 py-4"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center
                    bg-emerald-50 dark:bg-emerald-500/10
                    border border-emerald-100 dark:border-emerald-500/20">
                    <FiCheckCircle size={30} className="text-emerald-500" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-2
                      text-gray-900 dark:text-white">
                      Check your inbox
                    </h2>
                    <p className="text-sm leading-relaxed
                      text-gray-500 dark:text-white/40">
                      Firebase sent a reset link to{" "}
                      <span className="font-semibold text-gray-700 dark:text-white/70">
                        {email}
                      </span>.
                      Click the link in the email to set a new password.
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="w-full p-4 rounded-2xl text-sm
                    bg-indigo-50 dark:bg-indigo-500/8
                    border border-indigo-100 dark:border-indigo-500/20
                    text-indigo-700 dark:text-indigo-300 text-left">
                    <p className="font-semibold mb-1 text-xs uppercase tracking-widest opacity-70">
                      Didn't receive it?
                    </p>
                    <ul className="text-xs space-y-1 opacity-80 list-disc list-inside">
                      <li>Check your spam / junk folder</li>
                      <li>The link expires in 1 hour</li>
                      <li>
                        <button
                          onClick={() => { setSuccess(false); setEmail(""); }}
                          className="underline underline-offset-2 font-semibold"
                        >
                          Try a different email
                        </button>
                      </li>
                    </ul>
                  </div>

                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-sm font-semibold
                      text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FiArrowLeft size={14} /> Back to Sign In
                  </Link>
                </motion.div>

              ) : (

                /* ── Form ── */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                  <h1 className="text-2xl font-bold mb-1
                    text-gray-900 dark:text-white">
                    Forgot password?
                  </h1>
                  <p className="text-sm mb-7
                    text-gray-400 dark:text-white/40">
                    Enter your email — Firebase will send you a secure reset link instantly.
                  </p>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm
                          border-red-200 dark:border-red-500/20
                          bg-red-50 dark:bg-red-500/8
                          text-red-600 dark:text-red-400"
                      >
                        <FiAlertCircle size={14} className="shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email floating label */}
                    <div className="relative">
                      <FiMail
                        className="absolute left-4 top-4 text-gray-400 dark:text-white/30 pointer-events-none"
                        size={14}
                      />
                      <input
                        type="email" required value={email}
                        onFocus={() => setFocus("email")}
                        onBlur={() => setFocus("")}
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full pl-11 pr-4 pt-5 pb-2 rounded-xl border text-sm outline-none
                          transition-all bg-white dark:bg-white/5
                          text-gray-900 dark:text-white/90
                          ${focus === "email" || email
                            ? "border-indigo-500 dark:border-indigo-500/60 ring-2 ring-indigo-500/12"
                            : "border-gray-200 dark:border-white/10"
                          }`}
                      />
                      <label className={`absolute left-11 text-gray-400 dark:text-white/30 text-sm
                        transition-all pointer-events-none
                        ${email || focus === "email" ? "top-1 text-xs" : "top-3.5"}`}>
                        Email address
                      </label>
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                        text-sm font-bold text-white transition-all duration-200
                        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                        hover:brightness-110 active:scale-[0.98]
                        shadow-lg shadow-indigo-500/25
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {loading
                        ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending…</>
                        : <>Send Reset Link <FiArrowRight size={14} /></>
                      }
                    </button>

                  </form>

                  <div className="flex justify-center mt-6">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-sm font-semibold
                        text-gray-400 dark:text-white/35
                        hover:text-gray-700 dark:hover:text-white/70 transition-colors"
                    >
                      <FiArrowLeft size={14} /> Back to Sign In
                    </Link>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
