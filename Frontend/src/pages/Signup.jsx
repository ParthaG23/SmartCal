import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiAlertCircle, FiPhone, FiArrowRight,
  FiChevronDown, FiCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaCalculator } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

import {
  googleProvider,
  signInWithProvider,
  sendOTP,
} from "../config/firebase";

import { registerUser } from "../services/api";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const RECAPTCHA_STYLE = `#recaptcha-container { position: fixed; bottom: 0; right: 0; z-index: 9999; }`;

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+1",   flag: "🇺🇸", name: "USA" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
];

const getStrength = (pw) => {
  if (!pw) return null;
  if (pw.length < 6)  return { label: "Weak",   color: "bg-red-400",    width: "25%",  text: "text-red-400"    };
  if (pw.length < 10) return { label: "Good",   color: "bg-amber-400",  width: "60%",  text: "text-amber-400"  };
  return               { label: "Strong", color: "bg-emerald-400", width: "100%", text: "text-emerald-400" };
};

export default function Signup() {
  const [tab,          setTab]          = useState("email");
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPw,       setShowPw]       = useState(false);
  const [focus,        setFocus]        = useState("");

  /* phone */
  const [countryCode,  setCountryCode]  = useState("+91");
  const [phoneNum,     setPhoneNum]     = useState("");
  const [showCCDrop,   setShowCCDrop]   = useState(false);
  const [otp,          setOtp]          = useState(["","","","","",""]);
  const [otpSent,      setOtpSent]      = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [error,        setError]        = useState("");
  const [loadingMap,   setLoadingMap]   = useState({});

  const setLoading = (k, v) => setLoadingMap(p => ({ ...p, [k]: v }));
  const anyLoading = Object.values(loadingMap).some(Boolean);

  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const onError = (err, fallback = "Something went wrong.") =>
    setError(err?.response?.data?.message ?? err?.message ?? fallback);

  const exchange = async (firebaseToken) => {
    const res = await API.post("/auth/firebase", { firebaseToken });
    return res.data;
  };

  const getFullPhone = () => `${countryCode}${phoneNum.replace(/\D/g, "")}`;

  /* ── Google ── */
  const handleGoogle = async () => {
    setError("");
    setLoading("google", true);
    try {
      const { token: ft }   = await signInWithProvider(googleProvider);
      const { token, user } = await exchange(ft);
      login({ token, ...user });
      navigate("/");
    } catch (err) { onError(err, "Google sign-up failed."); }
    finally { setLoading("google", false); }
  };

  /* ── Email signup ── */
  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading("email", true);
    try {
      const res = await registerUser({ name, email, password });
      login({ token: res.data.token, ...res.data.user });
      navigate("/");
    } catch (err) { onError(err, "Signup failed. Please try again."); }
    finally { setLoading("email", false); }
  };

  /* ── Phone: send OTP ── */
  const handleSendOTP = async () => {
    const digits = phoneNum.replace(/\D/g, "");
    if (!digits || digits.length < 7)
      return setError("Enter a valid phone number.");

    const fullPhone = getFullPhone();
    setError("");
    setLoading("phone", true);
    try {
      const conf = await sendOTP(fullPhone);
      setConfirmation(conf);
      setOtpSent(true);
    } catch (err) {
      const code = err?.code;
      if (code === "auth/invalid-phone-number")
        setError("Invalid phone number. Please check the number and country code.");
      else if (code === "auth/too-many-requests")
        setError("Too many attempts. Please wait and try again.");
      else
        onError(err, "Failed to send OTP.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally { setLoading("phone", false); }
  };

  /* ── Phone: verify OTP ── */
  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Enter the complete 6-digit OTP.");
    setError("");
    setLoading("otp", true);
    try {
      const result          = await confirmation.confirm(code);
      const ft              = await result.user.getIdToken();
      const { token, user } = await exchange(ft);
      login({ token, ...user });
      navigate("/");
    } catch (err) { onError(err, "Invalid OTP."); }
    finally { setLoading("otp", false); }
  };

  const handleOtpDigit = (val, idx) => {
    const next = [...otp];
    next[idx] = val.replace(/\D/, "").slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`sotp-${idx + 1}`)?.focus();
  };
  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`sotp-${idx - 1}`)?.focus();
  };

  const switchToPhone = () => {
    setTab("phone");
    setError("");
    setOtpSent(false);
    setOtp(["","","","","",""]);
    setPhoneNum("");
  };

  const strength = getStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gray-50 dark:bg-[#09090b] px-4 transition-colors duration-300">

      <style>{RECAPTCHA_STYLE}</style>
      <div id="recaptcha-container" />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl
          flex flex-col-reverse lg:flex-row
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-[#111116]"
      >

        {/* ── Form panel LEFT ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-12">

          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm mb-6 text-gray-400 dark:text-white/40">Start using CalcVision today — it's free</p>

          {/* Google */}
          <button onClick={handleGoogle} disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4
              rounded-xl border text-sm font-semibold mb-3 transition-all duration-150
              border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5
              text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/8
              hover:border-gray-300 dark:hover:border-white/20
              disabled:opacity-50 disabled:cursor-not-allowed">
            {loadingMap.google
              ? <span className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />
              : <span className="text-xl font-bold text-blue-500">G</span>
            }
            Sign up with Google
          </button>

          {/* Phone toggle */}
          <button
            onClick={() => tab === "phone" ? (setTab("email"), setError("")) : switchToPhone()}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4
              rounded-xl border text-sm font-semibold mb-5 transition-all duration-150
              border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5
              text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/8
              hover:border-gray-300 dark:hover:border-white/20">
            <FiPhone size={16} />
            {tab === "phone" ? "Use Email instead" : "Sign up with Phone"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 dark:text-white/25">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm
                  border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/8
                  text-red-600 dark:text-red-400"
              >
                <FiAlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Email form ── */}
          <AnimatePresence mode="wait">
            {tab === "email" && (
              <motion.form key="email"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
                onSubmit={handleEmail} className="space-y-4">

                {/* Name */}
                <div className="relative">
                  <FiUser className="absolute left-4 top-4 text-gray-400 dark:text-white/30 pointer-events-none" size={14} />
                  <input type="text" required value={name}
                    onFocus={() => setFocus("name")} onBlur={() => setFocus("")}
                    onChange={e => setName(e.target.value)}
                    className={`w-full pl-11 pr-4 pt-5 pb-2 rounded-xl border text-sm outline-none transition-all
                      bg-white dark:bg-white/5 text-gray-900 dark:text-white/90
                      ${focus === "name" || name
                        ? "border-indigo-500 dark:border-indigo-500/60 ring-2 ring-indigo-500/12"
                        : "border-gray-200 dark:border-white/10"}`}
                  />
                  <label className={`absolute left-11 text-gray-400 dark:text-white/30 text-sm
                    transition-all pointer-events-none
                    ${name || focus === "name" ? "top-1 text-xs" : "top-3.5"}`}>
                    Full name
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <FiMail className="absolute left-4 top-4 text-gray-400 dark:text-white/30 pointer-events-none" size={14} />
                  <input type="email" required value={email}
                    onFocus={() => setFocus("email")} onBlur={() => setFocus("")}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 pt-5 pb-2 rounded-xl border text-sm outline-none transition-all
                      bg-white dark:bg-white/5 text-gray-900 dark:text-white/90
                      ${focus === "email" || email
                        ? "border-indigo-500 dark:border-indigo-500/60 ring-2 ring-indigo-500/12"
                        : "border-gray-200 dark:border-white/10"}`}
                  />
                  <label className={`absolute left-11 text-gray-400 dark:text-white/30 text-sm
                    transition-all pointer-events-none
                    ${email || focus === "email" ? "top-1 text-xs" : "top-3.5"}`}>
                    Email address
                  </label>
                </div>

                {/* Password + strength */}
                <div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-4 text-gray-400 dark:text-white/30 pointer-events-none" size={14} />
                    <input type={showPw ? "text" : "password"} required value={password}
                      onFocus={() => setFocus("password")} onBlur={() => setFocus("")}
                      onChange={e => setPassword(e.target.value)}
                      className={`w-full pl-11 pr-11 pt-5 pb-2 rounded-xl border text-sm outline-none transition-all
                        bg-white dark:bg-white/5 text-gray-900 dark:text-white/90
                        ${focus === "password" || password
                          ? "border-indigo-500 dark:border-indigo-500/60 ring-2 ring-indigo-500/12"
                          : "border-gray-200 dark:border-white/10"}`}
                    />
                    <label className={`absolute left-11 text-gray-400 dark:text-white/30 text-sm
                      transition-all pointer-events-none
                      ${password || focus === "password" ? "top-1 text-xs" : "top-3.5"}`}>
                      Password
                    </label>
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-3.5 text-gray-400 dark:text-white/25
                        hover:text-gray-600 dark:hover:text-white/60 transition-colors">
                      {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Strength</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${strength.text}`}>{strength.label}</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${strength.color}`}
                          animate={{ width: strength.width }} transition={{ duration: 0.4 }} />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={anyLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    text-sm font-bold text-white transition-all duration-200
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                    hover:brightness-110 active:scale-[0.98] shadow-lg shadow-indigo-500/25
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                  {loadingMap.email
                    ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating…</>
                    : <>Create Account <FiArrowRight size={14} /></>
                  }
                </button>
              </motion.form>
            )}

            {/* ── Phone form ── */}
            {tab === "phone" && (
              <motion.div key="phone"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                className="space-y-4">

                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5
                          text-gray-400 dark:text-white/30">
                          Phone number
                        </label>
                        <div className="flex gap-2">

                          {/* Country code dropdown */}
                          <div className="relative">
                            <button type="button" onClick={() => setShowCCDrop(s => !s)}
                              className="flex items-center gap-1.5 px-3 py-3 rounded-xl border text-sm
                                font-semibold whitespace-nowrap transition-all
                                border-gray-200 dark:border-white/10
                                bg-white dark:bg-white/5
                                text-gray-700 dark:text-white/70
                                hover:border-gray-300 dark:hover:border-white/20">
                              <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                              <span>{countryCode}</span>
                              <FiChevronDown size={12} className={`transition-transform ${showCCDrop ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                              {showCCDrop && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 mt-1 z-50 w-48
                                    rounded-xl border shadow-xl overflow-hidden
                                    border-gray-200 dark:border-white/10
                                    bg-white dark:bg-[#1c1c26]"
                                >
                                  <div className="max-h-48 overflow-y-auto py-1">
                                    {COUNTRY_CODES.map(c => (
                                      <button key={c.code} type="button"
                                        onClick={() => { setCountryCode(c.code); setShowCCDrop(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5
                                          text-sm transition-colors text-left
                                          hover:bg-gray-50 dark:hover:bg-white/6
                                          ${countryCode === c.code
                                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                                            : "text-gray-700 dark:text-white/70"}`}>
                                        <span className="text-base">{c.flag}</span>
                                        <span className="flex-1">{c.name}</span>
                                        <span className="text-xs text-gray-400 dark:text-white/30">{c.code}</span>
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Phone digits only */}
                          <input
                            value={phoneNum}
                            onChange={e => setPhoneNum(e.target.value.replace(/\D/g, ""))}
                            placeholder="98765 43210"
                            maxLength={12}
                            inputMode="numeric"
                            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none
                              transition-all font-mono
                              border-gray-200 dark:border-white/10
                              bg-white dark:bg-white/5
                              text-gray-900 dark:text-white/90
                              placeholder-gray-300 dark:placeholder-white/20
                              focus:border-indigo-500 dark:focus:border-indigo-500/60
                              focus:ring-2 focus:ring-indigo-500/12"
                          />
                        </div>

                        {phoneNum && (
                          <p className="text-[11px] mt-1.5 text-gray-400 dark:text-white/25">
                            Will send to:{" "}
                            <span className="font-mono font-semibold text-indigo-500 dark:text-indigo-400">
                              {getFullPhone()}
                            </span>
                          </p>
                        )}
                      </div>

                      <button onClick={handleSendOTP} disabled={anyLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                          text-sm font-bold text-white
                          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                          hover:brightness-110 shadow-lg shadow-indigo-500/25
                          disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {loadingMap.phone
                          ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending…</>
                          : <>Send OTP <FiArrowRight size={14} /></>
                        }
                      </button>
                    </motion.div>

                  ) : (
                    <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white/35 mb-3">
                          OTP sent to{" "}
                          <span className="font-mono font-semibold text-gray-700 dark:text-white/60">
                            {getFullPhone()}
                          </span>
                          {" — "}
                          <button onClick={() => { setOtpSent(false); setOtp(["","","","","",""]); }}
                            className="text-indigo-500 underline underline-offset-2">Change</button>
                        </p>
                        <div className="flex gap-2 justify-between">
                          {otp.map((digit, idx) => (
                            <input key={idx} id={`sotp-${idx}`} value={digit}
                              onChange={e => handleOtpDigit(e.target.value, idx)}
                              onKeyDown={e => handleOtpKey(e, idx)}
                              maxLength={1} inputMode="numeric"
                              className={`w-11 h-12 text-center text-lg font-bold rounded-xl border outline-none
                                transition-all bg-white dark:bg-white/5 text-gray-900 dark:text-white/90
                                ${digit
                                  ? "border-indigo-500 dark:border-indigo-500/60 ring-2 ring-indigo-500/12"
                                  : "border-gray-200 dark:border-white/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button onClick={handleVerifyOTP} disabled={anyLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                          text-sm font-bold text-white
                          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                          hover:brightness-110 shadow-lg shadow-indigo-500/25
                          disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {loadingMap.otp
                          ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Verifying…</>
                          : <>Verify & Create <FiArrowRight size={14} /></>
                        }
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-gray-400 dark:text-white/35 mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Colored panel RIGHT ── */}
        <motion.div
          className="relative lg:w-[42%] w-full min-h-[200px] lg:min-h-full
            flex flex-col items-center justify-center text-center px-10 py-12
            overflow-hidden select-none"
          style={{ background: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #6366f1 100%)" }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm
              flex items-center justify-center shadow-lg">
              <FaCalculator size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <HiSparkles className="text-yellow-300" size={16} />
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">CalcVision</span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Join<br />With Us!
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-[220px]">
                Already have an account? Sign in and continue where you left off.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-left w-full max-w-[200px]">
              {["Free forever",  "Full history", "Dark & light mode"].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <FiCheck size={10} className="text-white" />
                  </div>
                  <span className="text-white/75 text-xs font-medium">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/login"
              className="mt-2 px-8 py-2.5 rounded-full border-2 border-white/60
                text-white text-sm font-bold hover:bg-white hover:text-indigo-600
                transition-all duration-200">
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}