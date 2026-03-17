import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiTrash2, FiZap, FiSearch, FiX, FiRefreshCw } from "react-icons/fi";
import { getMyHistory, deleteHistoryItem, clearAllHistory } from "../services/api";

export default function History() {
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await getMyHistory();
      const data = res.data;
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all history? This cannot be undone.")) return;
    try {
      setClearing(true);
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const filtered = history.filter(item => {
    const q = search.toLowerCase();
    return (
      (item.calculatorName || "").toLowerCase().includes(q) ||
      (item.calculatorType || "").toLowerCase().includes(q) ||
      (item.summary        || "").toLowerCase().includes(q) ||
      (item.category       || "").toLowerCase().includes(q)
    );
  });

  const categoryColor = (cat = "") => {
    const map = {
      finance: { bg: "bg-amber-100 dark:bg-amber-500/15",    text: "text-amber-700 dark:text-amber-400",    bar: "bg-amber-400"   },
      math:    { bg: "bg-indigo-100 dark:bg-indigo-500/15",  text: "text-indigo-700 dark:text-indigo-400",  bar: "bg-indigo-400"  },
      health:  { bg: "bg-emerald-100 dark:bg-emerald-500/15",text: "text-emerald-700 dark:text-emerald-400",bar: "bg-emerald-400" },
      tax:     { bg: "bg-red-100 dark:bg-red-500/15",        text: "text-red-700 dark:text-red-400",        bar: "bg-red-400"     },
      general: { bg: "bg-violet-100 dark:bg-violet-500/15",  text: "text-violet-700 dark:text-violet-400",  bar: "bg-violet-400"  },
    };
    return map[cat.toLowerCase()] ?? {
      bg: "bg-gray-100 dark:bg-white/8",
      text: "text-gray-600 dark:text-gray-400",
      bar: "bg-gray-400"
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">

      {/* Ambient glow — dark only */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-96 opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% -5%, rgba(99,102,241,0.08), transparent 70%)" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-14 pb-24">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl
              bg-indigo-600 dark:bg-indigo-500/20 shadow-md shadow-indigo-500/20">
              <FiClock size={16} className="text-white dark:text-indigo-400" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase
              text-indigo-600 dark:text-indigo-400">
             CalcVision
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight
            text-gray-900 dark:text-white mb-2 leading-tight">
            Calculation History
          </h1>

          <p className="text-sm text-gray-400 dark:text-white/30">
            {loading
              ? "Loading your calculations…"
              : `${history.length} calculation${history.length !== 1 ? "s" : ""} saved`}
          </p>
        </motion.div>

        {/* ── Search + Actions bar ── */}
        {!loading && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-3 mb-7 items-center"
          >
            <div className="relative flex-1">
              <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2
                text-gray-400 dark:text-white/25 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, type, category…"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm outline-none
                  border border-gray-200 dark:border-white/10
                  bg-white dark:bg-white/4
                  text-gray-800 dark:text-white/80
                  placeholder-gray-400 dark:placeholder-white/25
                  focus:border-indigo-400 dark:focus:border-indigo-500/50
                  focus:ring-2 focus:ring-indigo-500/10
                  transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 dark:text-white/30
                    hover:text-gray-600 dark:hover:text-white/60"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            <button
              onClick={loadHistory}
              title="Refresh"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/4
                text-gray-500 dark:text-white/40
                hover:bg-gray-100 dark:hover:bg-white/8
                hover:text-gray-700 dark:hover:text-white/70
                transition-all duration-150"
            >
              <FiRefreshCw size={14} />
            </button>

            <button
              onClick={handleClear}
              disabled={clearing}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold
                border border-red-200 dark:border-red-500/20
                bg-red-50 dark:bg-red-500/8
                text-red-600 dark:text-red-400
                hover:bg-red-100 dark:hover:bg-red-500/15
                hover:border-red-300 dark:hover:border-red-500/35
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150 whitespace-nowrap"
            >
              {clearing ? "Clearing…" : "Clear all"}
            </button>
          </motion.div>
        )}

        {/* ── Skeleton loading ── */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-20 rounded-2xl animate-pulse bg-gray-200 dark:bg-white/5"
                style={{ opacity: 1 - i * 0.18 }}
              />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 rounded-2xl px-5 py-4
              border border-red-200 dark:border-red-500/20
              bg-red-50 dark:bg-red-500/8
              text-red-600 dark:text-red-400"
          >
            <FiZap size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">{error}</p>
              <button
                onClick={loadHistory}
                className="text-xs mt-1 underline underline-offset-2 opacity-75 hover:opacity-100"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-24 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center
              bg-indigo-50 dark:bg-indigo-500/10
              border border-indigo-100 dark:border-indigo-500/20">
              <FiClock size={26} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white/80 mb-1">
                No history yet
              </h3>
              <p className="text-sm text-gray-400 dark:text-white/30">
                Run a calculation to see it appear here.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── No search results ── */}
        {!loading && !error && history.length > 0 && filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-sm text-gray-400 dark:text-white/30"
          >
            No results for{" "}
            <span className="font-semibold text-gray-600 dark:text-white/50">"{search}"</span>
          </motion.p>
        )}

        {/* ── History list ── */}
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const colors = categoryColor(item.category);
            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, scale: 0.97 }}
                transition={{ delay: i * 0.035, duration: 0.28 }}
                className="group relative flex items-start gap-4 rounded-2xl mb-3 px-5 py-4
                  border border-gray-200 dark:border-white/8
                  bg-white dark:bg-white/3
                  hover:border-gray-300 dark:hover:border-white/15
                  hover:shadow-md dark:hover:shadow-black/30
                  hover:-translate-y-0.5
                  transition-all duration-200"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${colors.bar}`} />

                <div className="flex-1 min-w-0 pl-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-semibold text-sm
                      text-gray-800 dark:text-white/85 truncate">
                      {item.calculatorName || item.calculatorType}
                    </span>
                    {item.category && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider
                        px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-white/35 truncate leading-relaxed mb-2">
                    {item.summary || JSON.stringify(item.result)}
                  </p>

                  <p className="text-[11px] text-gray-400 dark:text-white/20 font-medium">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium", timeStyle: "short"
                    })}
                  </p>
                </div>

                {/* Delete — appears on hover */}
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting === item._id}
                  title="Delete"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5
                    rounded-lg text-xs font-semibold
                    border border-red-100 dark:border-red-500/15
                    bg-red-50 dark:bg-red-500/8
                    text-red-500 dark:text-red-400
                    hover:bg-red-100 dark:hover:bg-red-500/18
                    hover:border-red-200 dark:hover:border-red-500/30
                    disabled:opacity-40 disabled:cursor-not-allowed
                    opacity-0 group-hover:opacity-100
                    transition-all duration-150"
                >
                  <FiTrash2 size={12} />
                  {deleting === item._id ? "…" : "Delete"}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>
    </div>
  );
}
