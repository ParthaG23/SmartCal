import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focus,        setFocus]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      // ✅ flatten token + user into one object for AuthContext
      login({
  token:   credentialResponse.credential,
  id:      decoded.sub,
  name:    decoded.name,
  email:   decoded.email,
  picture: decoded.picture  // ← must be "picture" not "photo"
});

      navigate(from, { replace: true });

    } catch (err) {
      setError(err?.response?.data?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b] px-4 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[550px] h-[550px] bg-indigo-500/20 blur-[160px] rounded-full left-[-120px] top-[-120px]" />
        <div className="absolute w-[450px] h-[450px] bg-purple-500/20 blur-[140px] rounded-full right-[-120px] bottom-[-120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="p-8 rounded-3xl border border-gray-200 dark:border-white/10
          bg-white/90 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-xl">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/50 mb-6">
            Login to your SmartCalc account
          </p>

          <button
            type="button"
            className="group w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-white/10 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
          >
            <FcGoogle size={18} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          {/* error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              <FiAlertCircle className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-gray-400" />
              <input
                type="email"
                value={email}
                required
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus("")}
                onChange={(e) => setEmail(e.target.value)}
                className={`peer w-full pl-11 pr-4 pt-5 pb-2 rounded-xl border
                  bg-white dark:bg-[#111116] text-sm outline-none transition
                  ${focus === "email"
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-gray-200 dark:border-white/10"
                  }`}
              />
              <label className={`absolute left-11 text-gray-400 text-sm transition-all
                ${email || focus === "email" ? "top-1 text-xs" : "top-3.5"}`}>
                Email address
              </label>
            </div>

            {/* password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onFocus={() => setFocus("password")}
                onBlur={() => setFocus("")}
                onChange={(e) => setPassword(e.target.value)}
                className={`peer w-full pl-11 pr-12 pt-5 pb-2 rounded-xl border
                  bg-white dark:bg-[#111116] text-sm outline-none transition
                  ${focus === "password"
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-gray-200 dark:border-white/10"
                  }`}
              />
              <label className={`absolute left-11 text-gray-400 text-sm transition-all
                ${password || focus === "password" ? "top-1 text-xs" : "top-3.5"}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                hover:scale-[1.02] active:scale-[0.98] transition
                disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 dark:text-white/50 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}