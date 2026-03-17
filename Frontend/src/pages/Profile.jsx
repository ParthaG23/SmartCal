import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import API, { getMyHistory } from "../services/api";

import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiEdit3, FiSave, FiX, FiTrash2, FiShield,
  FiCheckCircle, FiAlertTriangle, FiClock,
  FiTrendingUp, FiZap, FiChevronDown,
  FiActivity, FiAward, FiRefreshCw,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { FaCalculator } from "react-icons/fa";

/* ─────────────────────────────────────────────
   GOOGLE FONT
───────────────────────────────────────────── */
const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
  .font-serif-display { font-family: 'Instrument Serif', serif !important; }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .animate-spin-slow { animation: spin-slow 0.75s linear infinite; }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }
  .dark .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
  }
  .avatar-glow-light::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 23px;
    background: linear-gradient(135deg, #d97706, transparent 55%, #d97706);
    opacity: 0.4;
    z-index: 0;
  }
  .avatar-glow-dark::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 23px;
    background: linear-gradient(135deg, #c9a84c, transparent 55%, #c9a84c);
    opacity: 0.5;
    z-index: 0;
  }
`;

/* ─────────────────────────────────────────────
   SPINNER
───────────────────────────────────────────── */
function Spinner({ light = false }) {
  return (
    <span className={`inline-block w-4 h-4 rounded-full border-2 animate-spin-slow flex-shrink-0
      ${light
        ? "border-white/30 border-t-white"
        : "border-gray-300 dark:border-white/20 border-t-gray-700 dark:border-t-white"
      }`}
    />
  );
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-3.5 rounded-2xl text-sm font-medium max-w-xs
        shadow-xl backdrop-blur-xl border
        ${type === "success"
          ? "bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
          : "bg-red-50 dark:bg-red-500/12 border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-300"
        }`}
    >
      {type === "success"
        ? <FiCheckCircle size={15} className="shrink-0" />
        : <FiAlertTriangle size={15} className="shrink-0" />
      }
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <FiX size={13} />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FIELD INPUT
───────────────────────────────────────────── */
function Field({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5
        text-gray-400 dark:text-white/30">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2
            text-gray-400 dark:text-white/25 pointer-events-none" />
        )}
        <input
          type={isPassword && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border text-sm outline-none transition-all duration-200
            py-3 pr-4
            ${Icon ? "pl-10" : "pl-4"}
            ${disabled
              ? "bg-gray-50 dark:bg-white/3 border-gray-100 dark:border-white/6 text-gray-400 dark:text-white/25 cursor-not-allowed"
              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white/90 placeholder-gray-300 dark:placeholder-white/20 hover:border-gray-300 dark:hover:border-white/20 focus:border-amber-400 dark:focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/15 dark:focus:ring-amber-500/10"
            }`}
        />
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 dark:text-white/25
              hover:text-gray-600 dark:hover:text-white/60 transition-colors"
          >
            {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, lightBg, darkBg, lightText, darkText, delay, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border p-4 flex flex-col gap-3
        bg-white dark:bg-white/3
        border-gray-200 dark:border-white/8
        hover:border-gray-300 dark:hover:border-white/15
        hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30
        transition-all duration-200"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${lightBg} ${darkBg}`}>
        <Icon size={16} className={`${lightText} ${darkText}`} />
      </div>
      {loading
        ? <div className="shimmer w-14 h-7" />
        : <div className="font-serif-display text-3xl text-gray-900 dark:text-white/90 leading-none tracking-tight">
            {value}
          </div>
      }
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">
        {label}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────── */
function SectionCard({ children, className = "", ...props }) {
  return (
    <motion.div
      className={`rounded-2xl border overflow-hidden
        bg-white dark:bg-white/3
        border-gray-200 dark:border-white/8
        hover:border-gray-300 dark:hover:border-white/14
        transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  const WORD = "DELETE";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 dark:bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        className="w-full max-w-md rounded-2xl border p-7
          bg-white dark:bg-[#13131a]
          border-red-200 dark:border-red-500/20
          shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4
          bg-red-50 dark:bg-red-500/10">
          <FiTrash2 size={20} className="text-red-500" />
        </div>

        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white/90">
          Delete your account
        </h3>
        <p className="text-sm leading-relaxed mb-5 text-gray-500 dark:text-white/35">
          This permanently removes your account and all calculation history.
          This action{" "}
          <span className="text-red-500 font-semibold">cannot be undone</span>.
        </p>

        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5
          text-gray-400 dark:text-white/30">
          Type <span className="text-red-500 font-mono">{WORD}</span> to confirm
        </label>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value.toUpperCase())}
          placeholder={WORD}
          className="w-full rounded-xl border px-4 py-3 text-sm font-mono mb-5 outline-none
            bg-gray-50 dark:bg-white/5
            border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white/90
            placeholder-gray-300 dark:placeholder-white/20
            focus:border-red-400 focus:ring-2 focus:ring-red-400/15
            transition-all duration-200"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              border border-gray-200 dark:border-white/10
              text-gray-600 dark:text-white/50
              hover:bg-gray-50 dark:hover:bg-white/5
              transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== WORD || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              text-sm font-bold text-white bg-red-500 hover:bg-red-600
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            {loading ? <><Spinner light /> Deleting…</> : "Delete account"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PROFILE PAGE
───────────────────────────────────────────── */
export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);

  const [toast,        setToast]        = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  const [stats,        setStats]        = useState({ total: 0, thisWeek: 0, favourite: "—", streak: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [editMode,     setEditMode]     = useState(false);
  const [nameVal,      setNameVal]      = useState(user?.name ?? "");
  const [emailVal,     setEmailVal]     = useState(user?.email ?? "");
  const [savingProfile,setSavingProfile]= useState(false);

  const [pwOpen,       setPwOpen]       = useState(false);
  const [currentPw,    setCurrentPw]    = useState("");
  const [newPw,        setNewPw]        = useState("");
  const [confirmPw,    setConfirmPw]    = useState("");
  const [savingPw,     setSavingPw]     = useState(false);

  const [deleteModal,  setDeleteModal]  = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    if (!editMode) {
      setNameVal(user?.name ?? "");
      setEmailVal(user?.email ?? "");
    }
  }, [user]);

  /* ── fetch stats ── */
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getMyHistory();
      const records = Array.isArray(res.data) ? res.data : [];
      const now = new Date();
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const thisWeek = records.filter(r => new Date(r.createdAt) >= weekAgo).length;
      const freq = {};
      records.forEach(r => {
        const k = r.calculatorName || r.calculatorType || "Unknown";
        freq[k] = (freq[k] ?? 0) + 1;
      });
      const favourite = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      const dayStrings = [...new Set(records.map(r => new Date(r.createdAt).toDateString()))];
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (dayStrings.includes(d.toDateString())) streak++;
        else break;
      }
      setStats({ total: records.length, thisWeek, favourite, streak });
    } catch { /* silent */ }
    finally { setStatsLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  /* ── save profile ── */
  const handleSaveProfile = async () => {
    if (!nameVal.trim()) return showToast("Name cannot be empty.", "error");
    setSavingProfile(true);
    try {
      const res = await API.put("/auth/profile", { name: nameVal.trim(), email: emailVal.trim() });
      login({ ...user, ...res.data.user });
      setEditMode(false);
      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Update failed.", "error");
    } finally { setSavingProfile(false); }
  };

  /* ── save password ── */
  const handleSavePassword = async () => {
    if (!currentPw) return showToast("Enter your current password.", "error");
    if (newPw.length < 6) return showToast("Password must be at least 6 characters.", "error");
    if (newPw !== confirmPw) return showToast("Passwords do not match.", "error");
    setSavingPw(true);
    try {
      await API.put("/auth/password", { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwOpen(false);
      showToast("Password changed successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Password change failed.", "error");
    } finally { setSavingPw(false); }
  };

  /* ── delete account ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete("/auth/account");
      logout();
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Delete failed.", "error");
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  const pwStrength = newPw.length === 0 ? null : newPw.length < 6 ? "weak" : newPw.length < 10 ? "good" : "strong";
  const pwMeta = {
    weak:   { width: "28%",  color: "bg-red-400",    label: "text-red-400"    },
    good:   { width: "62%",  color: "bg-amber-400",  label: "text-amber-400"  },
    strong: { width: "100%", color: "bg-emerald-400", label: "text-emerald-400" },
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  const avatarSrc = user?.picture || user?.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&background=d97706&color=fff&bold=true&size=128`;

  return (
    <div className="min-h-screen transition-colors duration-300
      bg-gray-50 dark:bg-[#0d0d12]">

      <style>{FONT_IMPORT}</style>

      {/* Ambient glow — visible in both modes */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[500px]
        opacity-30 dark:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse 55% 45% at 50% -5%, rgba(201,168,76,0.07), transparent 70%)" }}
      />
      <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 rounded-full
        opacity-20 dark:opacity-60 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative z-10 max-w-[920px] mx-auto px-4 py-12 pb-24">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-end justify-between gap-4 mb-10 flex-wrap"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2
              text-amber-600 dark:text-amber-500/70 flex items-center gap-2">
              <HiSparkles size={12} /> CalcVision
            </p>
            <h1 className="font-serif-display text-4xl lg:text-5xl leading-none tracking-tight
              text-gray-900 dark:text-white/92">
              My Profile
            </h1>
            <p className="text-sm mt-2 text-gray-400 dark:text-white/28">
              Manage your account &amp; track your activity
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              border border-gray-200 dark:border-white/10
              bg-white dark:bg-white/4
              text-gray-600 dark:text-white/50
              hover:bg-gray-100 dark:hover:bg-white/8
              hover:text-gray-800 dark:hover:text-white/80
              transition-all duration-150"
          >
            <FiRefreshCw size={13} />
            Refresh
          </button>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex flex-col gap-4">

            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border overflow-hidden
                bg-white dark:bg-white/3
                border-gray-200 dark:border-white/8"
            >
              {/* Top gradient area */}
              <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center gap-4
                bg-gradient-to-b from-amber-50/60 to-transparent
                dark:from-amber-500/5 dark:to-transparent
                border-b border-gray-100 dark:border-white/6">

                {/* Avatar */}
                <div className="relative inline-block avatar-glow-light dark:avatar-glow-dark">
                  <img
                    src={avatarSrc}
                    alt={user?.name}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=d97706&color=fff&bold=true&size=128`; }}
                    className="relative z-10 w-[88px] h-[88px] rounded-[20px] object-cover block"
                  />
                  {/* Online dot */}
                  <span className="absolute -bottom-1 -right-1 z-20 w-[18px] h-[18px] rounded-full
                    bg-emerald-500 border-2 border-white dark:border-[#13131a]" />
                </div>

                <div>
                  <div className="text-lg font-bold tracking-tight
                    text-gray-900 dark:text-white/92">
                    {user?.name ?? "—"}
                  </div>
                  <div className="text-xs mt-1 text-gray-400 dark:text-white/30">
                    {user?.email ?? "—"}
                  </div>
                </div>

                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                  text-[10px] font-bold uppercase tracking-widest
                  bg-amber-100 dark:bg-amber-500/12
                  border border-amber-200 dark:border-amber-500/20
                  text-amber-700 dark:text-amber-400">
                  <FaCalculator size={9} />
                  CalcVision Member
                </span>
              </div>

              {/* Meta rows */}
              <div className="px-5 py-2">
                {[
                  { icon: FiClock,    label: "Member since", value: joinDate },
                  {
                    icon: FiZap, label: "This week",
                    value: statsLoading
                      ? <span className="shimmer inline-block w-12 h-3.5" />
                      : `${stats.thisWeek} calcs`
                  },
                  {
                    icon: FiActivity, label: "Day streak",
                    value: statsLoading
                      ? <span className="shimmer inline-block w-9 h-3.5" />
                      : <span className={stats.streak > 0 ? "text-amber-500 dark:text-amber-400 font-bold" : ""}>
                          {stats.streak}d {stats.streak > 0 ? "🔥" : ""}
                        </span>
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}
                    className="flex items-center justify-between py-2.5 text-sm
                      border-b border-gray-100 dark:border-white/5 last:border-none">
                    <span className="flex items-center gap-2 text-gray-400 dark:text-white/28">
                      <Icon size={11} /> {label}
                    </span>
                    <span className="font-medium text-gray-600 dark:text-white/55">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={FaCalculator} label="Total calcs"    value={stats.total}
                lightBg="bg-amber-50"   darkBg="dark:bg-amber-500/10"
                lightText="text-amber-600" darkText="dark:text-amber-400"
                delay={0.1} loading={statsLoading} />
              <StatCard icon={FiTrendingUp} label="This week"      value={stats.thisWeek}
                lightBg="bg-indigo-50"  darkBg="dark:bg-indigo-500/10"
                lightText="text-indigo-600" darkText="dark:text-indigo-400"
                delay={0.15} loading={statsLoading} />
              <StatCard icon={FiZap}     label="Day streak"        value={`${stats.streak}d`}
                lightBg="bg-orange-50"  darkBg="dark:bg-orange-500/10"
                lightText="text-orange-500" darkText="dark:text-orange-400"
                delay={0.2} loading={statsLoading} />
              <StatCard icon={FiAward}   label="Top calc"
                value={stats.favourite.length > 7 ? stats.favourite.slice(0, 6) + "…" : stats.favourite}
                lightBg="bg-emerald-50" darkBg="dark:bg-emerald-500/10"
                lightText="text-emerald-600" darkText="dark:text-emerald-400"
                delay={0.25} loading={statsLoading} />
            </div>
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="flex flex-col gap-4">

            {/* ── Personal info ── */}
            <SectionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4
                border-b border-gray-100 dark:border-white/6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center
                    bg-amber-50 dark:bg-amber-500/10">
                    <FiUser size={14} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white/88">
                      Personal information
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-white/28 mt-0.5">
                      Update your name and email
                    </p>
                  </div>
                </div>

                {!editMode
                  ? <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-semibold
                        bg-amber-50 dark:bg-amber-500/10
                        border border-amber-200 dark:border-amber-500/20
                        text-amber-700 dark:text-amber-400
                        hover:bg-amber-100 dark:hover:bg-amber-500/18
                        transition-colors duration-150"
                    >
                      <FiEdit3 size={12} /> Edit
                    </button>
                  : <button
                      onClick={() => { setNameVal(user?.name ?? ""); setEmailVal(user?.email ?? ""); setEditMode(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-semibold
                        bg-gray-100 dark:bg-white/6
                        border border-gray-200 dark:border-white/10
                        text-gray-500 dark:text-white/45
                        hover:bg-gray-200 dark:hover:bg-white/10
                        transition-colors duration-150"
                    >
                      <FiX size={12} /> Cancel
                    </button>
                }
              </div>

              {/* Fields */}
              <div className="p-6 flex flex-col gap-4">
                <Field label="Full name"     icon={FiUser} value={editMode ? nameVal  : (user?.name  ?? "")} onChange={e => setNameVal(e.target.value)}  placeholder="Your full name"  disabled={!editMode} />
                <Field label="Email address" icon={FiMail} value={editMode ? emailVal : (user?.email ?? "")} onChange={e => setEmailVal(e.target.value)} placeholder="your@email.com" disabled={!editMode} />

                <AnimatePresence>
                  {editMode && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                        text-sm font-bold text-white
                        bg-gradient-to-r from-amber-500 to-amber-600
                        hover:from-amber-600 hover:to-amber-700
                        shadow-md shadow-amber-500/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200"
                    >
                      {savingProfile ? <><Spinner light /> Saving…</> : <><FiSave size={14} /> Save changes</>}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            {/* ── Change password ── */}
            <SectionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
            >
              <button
                onClick={() => setPwOpen(s => !s)}
                className="w-full text-left"
              >
                <div className={`flex items-center justify-between px-6 py-4
                  ${pwOpen ? "border-b border-gray-100 dark:border-white/6" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center
                      bg-violet-50 dark:bg-violet-500/10">
                      <FiShield size={14} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white/88">
                        Change password
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-white/28 mt-0.5">
                        Update your account security
                      </p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: pwOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 dark:text-white/25"
                  >
                    <FiChevronDown size={16} />
                  </motion.span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {pwOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="p-6 flex flex-col gap-4">
                      <Field label="Current password"    icon={FiLock} type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" />
                      <Field label="New password"        icon={FiLock} type="password" value={newPw}     onChange={e => setNewPw(e.target.value)}     placeholder="Minimum 6 characters" />
                      <Field label="Confirm new password" icon={FiLock} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" />

                      {/* Strength bar */}
                      {pwStrength && (
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest
                              text-gray-400 dark:text-white/28">
                              Strength
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest capitalize ${pwMeta[pwStrength].label}`}>
                              {pwStrength}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${pwMeta[pwStrength].color}`}
                              animate={{ width: pwMeta[pwStrength].width }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSavePassword}
                        disabled={savingPw}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                          text-sm font-bold text-white
                          bg-gradient-to-r from-violet-600 to-violet-700
                          hover:from-violet-700 hover:to-violet-800
                          shadow-md shadow-violet-500/20
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200"
                      >
                        {savingPw ? <><Spinner light /> Updating…</> : <><FiShield size={14} /> Update password</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* ── Danger zone ── */}
            <SectionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <div className="flex items-center gap-3 px-6 py-4
                border-b border-gray-100 dark:border-white/6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-red-50 dark:bg-red-500/10">
                  <FiAlertTriangle size={14} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white/88">
                    Danger zone
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-white/28 mt-0.5">
                    Irreversible — proceed with caution
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl
                  bg-red-50 dark:bg-red-500/5
                  border border-red-100 dark:border-red-500/12">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/75">
                      Delete account
                    </p>
                    <p className="text-xs mt-0.5 text-gray-400 dark:text-white/28">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl
                      text-sm font-semibold
                      border border-red-200 dark:border-red-500/25
                      text-red-600 dark:text-red-400
                      hover:bg-red-500 hover:text-white hover:border-red-500
                      transition-all duration-200"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>

      {/* ── Modals & toasts ── */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteModal
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(false)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
