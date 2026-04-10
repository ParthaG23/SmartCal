import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

import CategorySection from "../components/CategorySection";
import CalculatorCard  from "../components/CalculatorCard";
import { getCalculators } from "../services/api";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
    Footer links arrive as /categories?category=Finance
    so read that param as the initial active category.
  */
  const [category,    setCategory]    = useState(searchParams.get("category") || "All");
  const [calculators, setCalculators] = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* Keep URL in sync when user clicks a category pill */
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  /* React if user navigates here from Footer with a ?category= param */
  useEffect(() => {
    const param = searchParams.get("category");
    if (param) setCategory(param);
  }, [searchParams]);

  /* Fetch calculators once */
  useEffect(() => {
    (async () => {
      try {
        const res = await getCalculators();
        setCalculators(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to load calculators:", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = category === "All"
    ? calculators
    : calculators.filter(c => c.category === category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.3 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white/95 mb-2">
            Browse Categories
          </h1>
          <p className="text-sm text-gray-400 dark:text-white/35">
            {calculators.length} calculators across {[...new Set(calculators.map(c => c.category))].length} categories
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="mb-10">
          <CategorySection
            category={category}
            setCategory={handleCategoryChange}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/8 dark:bg-white/3"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-sm text-gray-400 dark:text-white/30">
            No calculators in{" "}
            <span className="font-semibold text-gray-600 dark:text-white/50">{category}</span>
          </div>
        ) : (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map(calc => (
              <CalculatorCard key={calc.slug} calculator={calc} />
            ))}
          </motion.div>
        )}

      </div>
       <Footer />
    </div>
  );
}
