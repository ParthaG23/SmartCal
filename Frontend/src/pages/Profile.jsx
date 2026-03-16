import { useState, useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiEdit3, FiSave, FiX, FiTrash2, FiShield,
  FiCheckCircle, FiAlertTriangle, FiClock,
  FiTrendingUp, FiZap,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { FaCalculator } from "react-icons/fa";

/* ================================================================
   TOAST
================================================================ */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium
        border backdrop-blur-xl
        ${type === "success"
          ? "bg-green-50/95 dark:bg-green-500/12 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
          : type === "error"
          ? "bg-red-50/95 dark:bg-red-500/12 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
          : "bg-white/95 dark:bg-white/8 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80"
        }`}
    >
      {type === "success" && <FiCheckCircle className="shrink-0 text-green-500" size={16} />}
      {type === "error"   && <FiAlertTriangle className="shrink-0 text-red-500" size={16} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
        <FiX size={14} />
      </button>
    </motion.div>
  );
}

/* ================================================================
   SECTION CARD
================================================================ */
function SectionCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border border-gray-200/80 dark:border-white/8
        bg-white dark:bg-[#111116] shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col gap-3 rounded-2xl border border-gray-200/80
        dark:border-white/8 bg-white dark:bg-[#111116] p-5 shadow-sm"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
        <p className="text-xs text-gray-400 dark:text-white/35 font-medium mt-0.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/* ================================================================
   AVATAR
================================================================ */
function Avatar({ user, size = "xl" }) {
  const dim =
    size === "xl" ? "w-20 h-20" :
    size === "lg" ? "w-14 h-14" : "w-10 h-10";

  const src =
    user?.picture ||
    user?.photo   ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&background=6366f1&color=fff&bold=true&size=128`;

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={user?.name}
        onError={e => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&background=6366f1&color=fff&bold=true&size=128`;
        }}
        className={`${dim} rounded-2xl object-cover
          ring-4 ring-white dark:ring-[#111116]
          shadow-lg shadow-indigo-500/20`}
      />
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center
        justify-center rounded-full bg-green-500 ring-2 ring-white dark:ring-[#111116]">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      </span>
    </div>
  );
}

/* ================================================================
   FIELD
================================================================ */
function Field({ label, icon: Icon, type = "text", value, onChange,
                 placeholder, disabled, suffix }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider
        text-gray-400 dark:text-white/35">
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
          className={`w-full rounded-xl border py-3 text-sm outline-none
            transition-all duration-200
            ${Icon ? "pl-10" : "pl-4"}
            ${suffix ? "pr-10" : "pr-4"}
            ${disabled
              ? "bg-gray-50 dark:bg-white/3 text-gray-400 dark:text-white/25 cursor-not-allowed border-gray-100 dark:border-white/5"
              : "bg-white dark:bg-white/5 text-gray-900 dark:text-white/90 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 dark:text-white/25
              hover:text-gray-600 dark:hover:text-white/60
              transition-colors"
          >
            {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   DELETE CONFIRM MODAL
================================================================ */
function DeleteModal({ onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  const CONFIRM_WORD = "DELETE";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{    scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-2xl border border-red-200/60
          dark:border-red-500/20 bg-white dark:bg-[#111116] p-6 shadow-2xl"
      >
        {/* icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl
          bg-red-50 dark:bg-red-500/10 mb-4">
          <FiTrash2 size={20} className="text-red-500" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Delete account
        </h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-5 leading-relaxed">
          This will permanently delete your account and all calculation history.
          This action <span className="font-semibold text-red-500">cannot be undone</span>.
        </p>

        <div className="mb-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider
            text-gray-400 dark:text-white/35 block mb-1.5">
            Type <span className="text-red-500 font-mono">{CONFIRM_WORD}</span> to confirm
          </label>
          <input
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value.toUpperCase())}
            placeholder={CONFIRM_WORD}
            className="w-full rounded-xl border border-gray-200 dark:border-white/10
              bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-mono
              text-gray-900 dark:text-white/90 outline-none
              focus:border-red-400 focus:ring-2 focus:ring-red-500/15
              transition-all duration-200"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium
              border border-gray-200 dark:border-white/10
              text-gray-600 dark:text-white/60
              hover:bg-gray-50 dark:hover:bg-white/5
              transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== CONFIRM_WORD || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              text-white bg-red-500 hover:bg-red-600
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            {loading ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   MAIN PAGE
================================================================ */
export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);

  /* ── toast ── */
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  /* ── stats ── */
  const [stats, setStats] = useState({
    total: 0, thisWeek: 0, favourite: "—", streak: 0,
  });

  /* ── profile edit ── */
  const [editMode,   setEditMode]   = useState(false);
  const [nameVal,    setNameVal]    = useState(user?.name  ?? "");
  const [emailVal,   setEmailVal]   = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── password ── */
  const [pwSection,   setPwSection]   = useState(false);
  const [currentPw,   setCurrentPw]   = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [savingPw,    setSavingPw]    = useState(false);

  /* ── delete ── */
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  /* ── fetch stats on mount ── */
  useEffect(() => {
    (async () => {
      try {
        const res     = await API.get("/calculators/history?limit=200");
        const records = res.data.data ?? [];
        const now     = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const thisWeek = records.filter(r =>
          new Date(r.createdAt) >= weekAgo
        ).length;

        /* most used calculator */
        const freq = {};
        records.forEach(r => {
          freq[r.calculatorName] = (freq[r.calculatorName] ?? 0) + 1;
        });
        const favourite = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

        /* day streak */
        const days = [...new Set(
          records.map(r => new Date(r.createdAt).toDateString())
        )];
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          if (days.includes(d.toDateString())) streak++;
          else break;
        }

        setStats({ total: records.length, thisWeek, favourite, streak });
      } catch {
        /* history fetch failed — leave defaults */
      }
    })();
  }, []);

  /* ── save profile ── */
  const handleSaveProfile = async () => {
    if (!nameVal.trim()) return showToast("Name cannot be empty.", "error");
    setSavingProfile(true);
    try {
      const res = await API.put("/auth/profile", {
        name:  nameVal.trim(),
        email: emailVal.trim(),
      });
      login({ ...user, ...res.data.user });
      setEditMode(false);
      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Update failed.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ── save password ── */
  const handleSavePassword = async () => {
    if (newPw.length < 6)      return showToast("Password must be at least 6 characters.", "error");
    if (newPw !== confirmPw)   return showToast("Passwords do not match.", "error");
    if (!currentPw)            return showToast("Enter your current password.", "error");
    setSavingPw(true);
    try {
      await API.put("/auth/password", { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwSection(false);
      showToast("Password changed successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Password change failed.", "error");
    } finally {
      setSavingPw(false);
    }
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

  /* ── cancel edit ── */
  const cancelEdit = () => {
    setNameVal(user?.name  ?? "");
    setEmailVal(user?.email ?? "");
    setEditMode(false);
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0e] transition-colors duration-300">

      {/* ── ambient glow ── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[500px] opacity-0
        dark:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% -10%, #6366f115, transparent 70%)" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10 lg:px-8">

        {/* ── page title ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0   }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight
            text-gray-900 dark:text-white/95">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-white/35">
            Manage your account settings and view your activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-start">

          {/* ═══════════════════════════════════
              LEFT COLUMN — identity card
          ═══════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* identity card */}
            <SectionCard>
              <div className="relative overflow-hidden rounded-t-2xl px-6 pt-8 pb-6
                bg-gradient-to-br from-indigo-50 via-purple-50/40 to-transparent
                dark:from-indigo-500/8 dark:via-purple-500/4 dark:to-transparent
                border-b border-gray-100 dark:border-white/6">

                <HiSparkles className="absolute top-5 right-5
                  text-xl text-indigo-300 dark:text-indigo-500/40" />

                <div className="flex flex-col items-center text-center gap-3">
                  <Avatar user={user} size="xl" />

                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white/95">
                      {user?.name}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full
                    px-3 py-1 text-[11px] font-semibold
                    bg-indigo-100 dark:bg-indigo-500/15
                    text-indigo-600 dark:text-indigo-400
                    border border-indigo-200/60 dark:border-indigo-500/20">
                    <FaCalculator size={10} />
                    SmartCalc Member
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 dark:text-white/30 flex items-center gap-2">
                    <FiClock size={12} /> Member since
                  </span>
                  <span className="font-medium text-gray-700 dark:text-white/70">
                    {joinDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 dark:text-white/30 flex items-center gap-2">
                    <FiZap size={12} /> This week
                  </span>
                  <span className="font-medium text-gray-700 dark:text-white/70">
                    {stats.thisWeek} calculations
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 dark:text-white/30 flex items-center gap-2">
                    <FiTrendingUp size={12} /> Day streak
                  </span>
                  <span className="font-medium text-gray-700 dark:text-white/70">
                    {stats.streak} {stats.streak === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={FaCalculator}
                label="Total calculations"
                value={stats.total}
                color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                delay={0.1}
              />
              <StatCard
                icon={FiTrendingUp}
                label="This week"
                value={stats.thisWeek}
                color="bg-purple-50 dark:bg-purple-500/10 text-purple-500 dark:text-purple-400"
                delay={0.15}
              />
              <StatCard
                icon={FiZap}
                label="Day streak"
                value={`${stats.streak}d`}
                color="bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400"
                delay={0.2}
              />
              <StatCard
                icon={HiSparkles}
                label="Top calculator"
                value={stats.favourite.length > 8
                  ? stats.favourite.slice(0, 7) + "…"
                  : stats.favourite}
                color="bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400"
                delay={0.25}
              />
            </div>

          </div>

          {/* ═══════════════════════════════════
              RIGHT COLUMN — forms
          ═══════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── Edit profile ── */}
            <SectionCard>
              <div className="flex items-center justify-between px-6 py-4
                border-b border-gray-100 dark:border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg
                    bg-indigo-50 dark:bg-indigo-500/10
                    text-indigo-500 dark:text-indigo-400">
                    <FiUser size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white/90">
                      Personal information
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-white/25">
                      Update your name and email address
                    </p>
                  </div>
                </div>

                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-semibold
                      bg-indigo-50 dark:bg-indigo-500/10
                      text-indigo-600 dark:text-indigo-400
                      hover:bg-indigo-100 dark:hover:bg-indigo-500/20
                      border border-indigo-200/60 dark:border-indigo-500/20
                      transition-colors duration-150"
                  >
                    <FiEdit3 size={12} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-semibold
                      text-gray-500 dark:text-white/40
                      hover:bg-gray-100 dark:hover:bg-white/5
                      transition-colors duration-150"
                  >
                    <FiX size={12} /> Cancel
                  </button>
                )}
              </div>

              <div className="p-6 flex flex-col gap-4">
                <Field
                  label="Full name"
                  icon={FiUser}
                  value={editMode ? nameVal : (user?.name ?? "")}
                  onChange={e => setNameVal(e.target.value)}
                  placeholder="Your name"
                  disabled={!editMode}
                />
                <Field
                  label="Email address"
                  icon={FiMail}
                  value={editMode ? emailVal : (user?.email ?? "")}
                  onChange={e => setEmailVal(e.target.value)}
                  placeholder="your@email.com"
                  disabled={!editMode}
                />

                <AnimatePresence>
                  {editMode && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: 8 }}
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center justify-center gap-2
                        w-full py-3 rounded-xl text-sm font-semibold text-white
                        bg-gradient-to-r from-indigo-600 to-indigo-500
                        hover:from-indigo-700 hover:to-indigo-600
                        shadow-md shadow-indigo-500/25
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all duration-200"
                    >
                      {savingProfile
                        ? <><span className="h-4 w-4 rounded-full border-2
                            border-white/30 border-t-white animate-spin" />
                            Saving…</>
                        : <><FiSave size={14} /> Save changes</>
                      }
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            {/* ── Change password ── */}
            <SectionCard>
              <button
                onClick={() => setPwSection(s => !s)}
                className="flex items-center justify-between w-full px-6 py-4
                  border-b border-gray-100 dark:border-white/6
                  hover:bg-gray-50/50 dark:hover:bg-white/2
                  transition-colors duration-150 rounded-t-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg
                    bg-purple-50 dark:bg-purple-500/10
                    text-purple-500 dark:text-purple-400">
                    <FiShield size={14} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white/90">
                      Change password
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-white/25">
                      Update your account password
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: pwSection ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 dark:text-white/25"
                >
                  <FiChevronDown size={16} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {pwSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{    height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 flex flex-col gap-4">
                      <Field
                        label="Current password"
                        icon={FiLock}
                        type="password"
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Field
                        label="New password"
                        icon={FiLock}
                        type="password"
                        value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        placeholder="Min. 6 characters"
                      />
                      <Field
                        label="Confirm new password"
                        icon={FiLock}
                        type="password"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="Repeat new password"
                      />

                      {/* strength bar */}
                      {newPw.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400 dark:text-white/30">
                              Password strength
                            </span>
                            <span className={
                              newPw.length < 6  ? "text-red-400" :
                              newPw.length < 10 ? "text-amber-400" : "text-green-400"
                            }>
                              {newPw.length < 6  ? "Weak" :
                               newPw.length < 10 ? "Good" : "Strong"}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width:
                                newPw.length < 6  ? "25%" :
                                newPw.length < 10 ? "65%" : "100%"
                              }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                newPw.length < 6  ? "bg-red-400" :
                                newPw.length < 10 ? "bg-amber-400" : "bg-green-400"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSavePassword}
                        disabled={savingPw}
                        className="flex items-center justify-center gap-2
                          w-full py-3 rounded-xl text-sm font-semibold text-white
                          bg-gradient-to-r from-purple-600 to-purple-500
                          hover:from-purple-700 hover:to-purple-600
                          shadow-md shadow-purple-500/25
                          disabled:opacity-60 disabled:cursor-not-allowed
                          transition-all duration-200"
                      >
                        {savingPw
                          ? <><span className="h-4 w-4 rounded-full border-2
                              border-white/30 border-t-white animate-spin" />
                              Updating…</>
                          : <><FiShield size={14} /> Update password</>
                        }
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* ── Danger zone ── */}
            <SectionCard>
              <div className="px-6 py-4 border-b border-red-100/80 dark:border-red-500/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg
                    bg-red-50 dark:bg-red-500/10 text-red-500">
                    <FiAlertTriangle size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white/90">
                      Danger zone
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-white/25">
                      Irreversible actions — proceed with caution
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4
                  rounded-xl border border-red-100 dark:border-red-500/15
                  bg-red-50/50 dark:bg-red-500/5 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/80">
                      Delete account
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl
                      text-sm font-semibold text-red-600 dark:text-red-400
                      border border-red-200 dark:border-red-500/25
                      hover:bg-red-500 hover:text-white hover:border-red-500
                      dark:hover:bg-red-500 dark:hover:text-white
                      transition-all duration-200"
                  >
                    <FiTrash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>

      {/* ── Delete modal ── */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteModal
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(false)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
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

/* missing import for FiChevronDown */
function FiChevronDown({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
