import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculate, getCalculators } from "../services/api";
import { FaCalculator } from "react-icons/fa";
import { MdOutlineCalculate } from "react-icons/md";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";
import ChartDashboard from "../components/ChartDashboard";

/* ================================================================
   CATEGORY STYLES
================================================================ */
const CAT = {
  Finance:  { ring:"#6366f1", lb:"bg-indigo-50 text-indigo-600 border-indigo-200",  db:"dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25" },
  Math:     { ring:"#3b82f6", lb:"bg-blue-50 text-blue-600 border-blue-200",        db:"dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25" },
  Health:   { ring:"#ec4899", lb:"bg-pink-50 text-pink-600 border-pink-200",        db:"dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/25" },
  Science:  { ring:"#a855f7", lb:"bg-purple-50 text-purple-600 border-purple-200",  db:"dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/25" },
  Shopping: { ring:"#f97316", lb:"bg-orange-50 text-orange-600 border-orange-200",  db:"dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25" },
  Travel:   { ring:"#06b6d4", lb:"bg-cyan-50 text-cyan-600 border-cyan-200",        db:"dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/25" },
  Personal: { ring:"#f59e0b", lb:"bg-amber-50 text-amber-600 border-amber-200",     db:"dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25" },
  Default:  { ring:"#6366f1", lb:"bg-indigo-50 text-indigo-600 border-indigo-200",  db:"dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25" },
};

/* ================================================================
   LABEL FORMATTER
================================================================ */
function formatLabel(raw) {
  return String(raw)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/* ================================================================
   CARD WRAPPER
================================================================ */
function DashCard({ title, accent, children }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111116] dark:bg-white/5">
      {title && (
        <div className="flex items-center gap-2 px-5 py-3" style={{ color: accent }}>
          <HiSparkles className="text-sm shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
      )}
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}

/* ================================================================
   FIELD
================================================================ */
function Field({ field, value, unit, onInput, onUnit, accent }) {
  const isSelect = field.type === "select";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
          {field.label}
        </label>
        {field.units && field.units.length > 1 && (
          <div className="flex items-center gap-1">
            {field.units.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => onUnit(field.name, u)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all duration-150 border
                  ${unit === u
                    ? "text-white border-transparent shadow-sm"
                    : "bg-transparent text-gray-400 border-gray-200 hover:border-gray-300 dark:text-white/35 dark:border-white/10 dark:hover:border-white/25"
                  }`}
                style={unit === u ? { background: accent, borderColor: accent } : {}}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>

      {isSelect ? (
        <select
          name={field.name}
          value={value ?? field.options?.[0]?.value ?? ""}
          onChange={onInput}
          className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none cursor-pointer transition-all duration-200 text-gray-700 hover:bg-gray-100 focus:bg-white dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus:bg-white/10"
          onFocus={e => { e.target.style.boxShadow = `0 0 0 2px ${accent}40`; }}
          onBlur={e  => { e.target.style.boxShadow = ""; }}
        >
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type ?? "number"}
          name={field.name}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={onInput}
          className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm font-mono outline-none transition-all duration-200 text-gray-900 placeholder-gray-300 hover:bg-gray-100 focus:bg-white focus:ring-2 dark:bg-white/5 dark:text-white/90 dark:placeholder-white/20 dark:hover:bg-white/10 dark:focus:bg-white/10"
          style={{ "--tw-ring-color": `${accent}30` }}
          onFocus={e => { e.target.style.boxShadow = `0 0 0 2px ${accent}40`; }}
          onBlur={e  => { e.target.style.boxShadow = ""; }}
        />
      )}

      {field.hint && (
        <p className="text-[11px] text-gray-400 dark:text-white/25 leading-snug">{field.hint}</p>
      )}
    </div>
  );
}

/* ================================================================
   SKELETON
================================================================ */
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-white/8" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-gray-200 dark:bg-white/8" />
          <div className="h-4 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 space-y-4 dark:bg-white/5">
          {[1, 2, 3].map(n => (
            <div key={n} className="space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/8" />
              <div className="h-11 rounded-xl bg-gray-100 dark:bg-white/5" />
            </div>
          ))}
          <div className="h-12 rounded-xl bg-gray-200 dark:bg-white/8" />
        </div>
        <div className="rounded-2xl bg-white p-6 dark:bg-white/5 lg:col-span-2 h-64" />
      </div>
    </div>
  );
}

/* ================================================================
   PAGE
================================================================ */
export default function CalculatorPage() {
  const { type }  = useParams();
  const navigate  = useNavigate();

  const [calculator,  setCalculator]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [inputs,      setInputs]      = useState({});
  const [units,       setUnits]       = useState({});
  const [result,      setResult]      = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error,       setError]       = useState(null);

  /* load calculator definition */
  useEffect(() => {
    setResult(null); setError(null); setInputs({}); setUnits({}); setLoading(true);
    (async () => {
      try {
        const res  = await getCalculators();
        const calc = res.data.data.find(c => c.slug === type || c.name?.toLowerCase().replace(/\s+/g, "") === type);
        setCalculator(calc ?? null);
        if (calc?.fields) {
          const defaults = {};
          calc.fields.forEach(f => { if (f.units?.length) defaults[f.name] = f.units[0]; });
          setUnits(defaults);
        }
      } catch { setError("Failed to load calculator."); }
      finally  { setLoading(false); }
    })();
  }, [type]);

  /* field handlers */
  const handleInput = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setResult(null);
  };

  const handleUnit = (fieldName, unit) => {
    setUnits(prev => ({ ...prev, [fieldName]: unit }));
    setResult(null);
  };

  /* calculate */
  const handleCalculate = async () => {
    setError(null);
    setCalculating(true);
    try {
      const payload = { ...inputs };
      Object.entries(units).forEach(([field, unit]) => {
        payload[`${field}_unit`] = unit;
      });
      const res = await calculate(type, payload);
      setResult(res.data.result);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Calculation failed.");
    } finally {
      setCalculating(false);
    }
  };

  const style  = CAT[calculator?.category] ?? CAT.Default;
  const accent = style.ring;

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[#0a0a0e] relative">

      {/*
        FIX: Removed `mix-blend-multiply` from the light-mode glow.
        mix-blend-multiply caused the glow color to darken white card backgrounds,
        making stat cards look washed-out/ghostly in light mode.
        The glow is now a plain radial gradient with no blend mode in light mode.
        Dark mode keeps `mix-blend-screen` which brightens correctly on dark surfaces.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-30 dark:opacity-50 dark:mix-blend-screen transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% -20%, ${accent}40, transparent 70%)`
        }}
      />

      {/*
        FIX: Dot grid is explicitly z-0 so it can never layer above card content.
        Previously it had no z-index and sat in paint order above the glow but
        the combined stacking was interfering with card rendering in some browsers.
      */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-50 transition-opacity duration-300 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTUwLDE1MCwxNTAsMC4xMikiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNikiLz48L3N2Zz4=')]" />

      <div className="relative px-4 py-10 lg:px-8 z-10">

        {/* back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 dark:text-white/35 dark:hover:text-white/70 transition-colors"
        >
          <HiArrowLeft /> All Calculators
        </button>

        {loading && <Skeleton />}

        {!loading && error && !calculator && (
          <div className="rounded-2xl border px-6 py-5 text-sm border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/8 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !calculator && !error && (
          <div className="py-24 text-center text-sm text-gray-400 dark:text-white/35">
            Calculator <span className="font-mono text-gray-600 dark:text-white/55">"{type}"</span> not found.
          </div>
        )}

        {!loading && calculator && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* page header */}
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${accent}1a` }}
                >
                  <FaCalculator className="text-xl" style={{ color: accent }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white/95">
                    {calculator.name}
                  </h1>
                  {calculator.category && (
                    <span className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style.lb} ${style.db}`}>
                      {calculator.category}
                    </span>
                  )}
                </div>
              </div>
              {calculator.description && (
                <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-white/40 mt-1">
                  {calculator.description}
                </p>
              )}
            </div>

            {/* dashboard grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">

              {/* LEFT — sticky form */}
              <div className="lg:sticky lg:top-6">
                <DashCard title={`${calculator.name} Inputs`} accent={accent}>
                  <div className="flex flex-col gap-5">
                    {calculator.fields.map((field, i) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.22 }}
                      >
                        <Field
                          field={field}
                          value={inputs[field.name]}
                          unit={units[field.name] ?? field.units?.[0]}
                          onInput={handleInput}
                          onUnit={handleUnit}
                          accent={accent}
                        />
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-500 dark:text-red-400"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={handleCalculate}
                      disabled={calculating}
                      whileTap={{ scale: 0.97 }}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:opacity-55 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                        boxShadow: `0 4px 24px ${accent}35`,
                      }}
                    >
                      {calculating ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Calculating…
                        </>
                      ) : (
                        <><MdOutlineCalculate className="text-xl" /> Calculate</>
                      )}
                    </motion.button>
                  </div>
                </DashCard>

                {calculator.formula && (
                  <p className="mt-3 text-center font-mono text-xs text-gray-400 dark:text-white/20">
                    {calculator.formula}
                  </p>
                )}
              </div>

              {/* RIGHT — charts */}
              <div className="lg:col-span-2">
                {result === null ? (
                  <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="flex flex-col items-center gap-3 text-center px-6">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: `${accent}15` }}
                      >
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-white/40">
                          Enter values and hit <span style={{ color: accent }}>Calculate</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-300 dark:text-white/20">
                          Charts and insights will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ChartDashboard
                    slug={type}
                    inputs={inputs}
                    result={result}
                    accent={accent}
                  />
                )}
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}