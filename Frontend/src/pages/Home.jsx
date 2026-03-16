import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import CalculatorCard from "../components/CalculatorCard";
import Footer from "../components/Footer";
import { getCalculators } from "../services/api";

import { HiSparkles, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const TRENDING_SLUGS = ["emi", "bmi", "gst", "compoundInterest"];

export default function Home() {
const [calculators, setCalculators] = useState([]);
const [category, setCategory] = useState("All");
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);

const [searchParams] = useSearchParams();
const querySearch = searchParams.get("search") || "";

useEffect(() => {
(async () => {
try {
const res = await getCalculators();
setCalculators(res.data.data || []);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
})();
}, []);

useEffect(() => {
if (querySearch) {
setSearch(querySearch);
}
}, [querySearch]);

const trending = calculators.filter(c =>
TRENDING_SLUGS.includes(c.slug)
);

let filtered = calculators;

const activeSearch = search || querySearch;

if (activeSearch) {
filtered = filtered.filter(c =>
c.name?.toLowerCase().includes(activeSearch.toLowerCase())
);
}

if (category !== "All") {
filtered = filtered.filter(c => c.category === category);
}

const Skeleton = ({ count = 8 }) => ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
{Array.from({ length: count }).map((_, i) => ( <div
       key={i}
       className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/8 dark:bg-white/3"
     />
))} </div>
);

return ( <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">


  <Hero />

  {/* Search */}
  <section className="w-full px-4 md:px-10 xl:px-16 -mt-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative max-w-3xl mx-auto"
    >
      <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 text-lg pointer-events-none" />

      <input
        placeholder="Search calculators…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-11 pr-10 py-4 rounded-2xl text-sm border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-lg shadow-black/5 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-[#111116] dark:text-white/90 dark:placeholder-white/30 dark:shadow-black/20 dark:focus:border-indigo-500/60 dark:focus:ring-indigo-500/10"
      />

      <AnimatePresence>
        {search && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60 transition-colors"
          >
            <HiXMark className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  </section>

  <div className="w-full px-4 md:px-10 xl:px-16">

    {/* Trending */}
    {!activeSearch && (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-14"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15">
            <HiSparkles className="text-sm text-amber-500 dark:text-amber-400" />
          </div>

          <h2 className="text-base font-bold text-gray-900 dark:text-white/90 tracking-tight">
            Trending Calculators
          </h2>

          <span className="ml-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
            Popular
          </span>
        </div>

        {loading ? (
          <Skeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {trending.map((calc, i) => (
              <motion.div
                key={calc.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
              >
                <CalculatorCard calculator={{ ...calc, popular: true }} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    )}

    {/* Category */}
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-14"
    >
      <CategorySection category={category} setCategory={setCategory} />
    </motion.section>

    {/* All calculators */}
    <section id="calculators" className="mt-8 pb-20">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white/90 tracking-tight">
          {activeSearch
            ? `Results for "${activeSearch}"`
            : category === "All"
            ? "All Calculators"
            : `${category} Calculators`}
        </h2>

        <span className="text-xs text-gray-400 dark:text-white/30 font-medium">
          {filtered.length}{" "}
          {filtered.length === 1 ? "calculator" : "calculators"}
        </span>
      </div>

      {loading ? (
        <Skeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
            <HiMagnifyingGlass className="text-2xl text-gray-300 dark:text-white/20" />
          </div>

          <p className="text-sm font-medium text-gray-400 dark:text-white/30">
            No calculators found
          </p>
        </div>
      ) : (
        <motion.div
          key={`${category}-${activeSearch}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        >
          {filtered.map((calc, i) => (
            <motion.div
              key={calc.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i * 0.04, 0.3),
                duration: 0.25,
              }}
            >
              <CalculatorCard calculator={calc} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  </div>

  <Footer />
</div>


);
}
