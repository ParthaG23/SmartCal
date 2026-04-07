import { memo, useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

/* ── Nav links ── */
const LINKS = [
  { name: "Home",       path: "/",           icon: "🏠" },
  { name: "Categories", path: "/categories", icon: "📂" },
  { name: "About",      path: "/about",      icon: "ℹ️" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search,   setSearch]   = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const searchRef    = useRef(null);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  /* detect scroll for glass effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    searchRef.current?.blur();
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/60 dark:border-white/[0.06] bg-white/75 dark:bg-[#09090b]/80 backdrop-blur-2xl shadow-sm dark:shadow-black/20"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="w-full px-4 sm:px-6 xl:px-16">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
              }}
            >
              <FaCalculator className="text-white text-sm relative z-10" />
              {/* subtle glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 20px rgba(99,102,241,0.4)" }} />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold tracking-tight leading-tight
                text-gray-900 dark:text-white/95">
                Calc<span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #ec4899)" }}>Vision</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] leading-none
                text-gray-400 dark:text-white/20 hidden sm:block">
                Smart Calculator
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5 p-1 rounded-2xl
            bg-gray-100/70 dark:bg-white/[0.04]
            border border-gray-200/50 dark:border-white/[0.06]">
            {LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-xl text-[13px] font-semibold
                    transition-all duration-200 select-none
                    ${active
                      ? "text-white dark:text-white"
                      : "text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70"
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <form onSubmit={handleSearch}
              className="hidden lg:flex items-center relative">
              <FiSearch className={`absolute left-3 text-sm pointer-events-none transition-colors duration-200 ${
                searchFocused ? "text-indigo-500" : "text-gray-400 dark:text-white/25"
              }`} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search 70+ calculators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-56 pl-9 pr-3 py-2 text-[13px] rounded-xl
                  border bg-gray-50/80 dark:bg-white/[0.03]
                  dark:text-white/80
                  placeholder-gray-400 dark:placeholder-white/20
                  focus:outline-none
                  transition-all duration-300
                  ${searchFocused
                    ? "w-72 border-indigo-400 dark:border-indigo-500/50 ring-2 ring-indigo-500/15 dark:ring-indigo-500/10 shadow-lg shadow-indigo-500/5"
                    : "border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10"
                  }`}
              />
              {search && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 pointer-events-none">
                  ↵
                </motion.span>
              )}
            </form>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl
                border transition-all duration-200
                border-gray-200/80 bg-white/80
                dark:border-white/[0.08] dark:bg-white/[0.04]
                text-gray-500 dark:text-white/50
                hover:text-amber-500 dark:hover:text-amber-400
                hover:border-amber-200 dark:hover:border-amber-500/25
                hover:shadow-md hover:shadow-amber-500/10"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* ── Mobile menu button ── */}
            <motion.button
              onClick={() => setMenuOpen(o => !o)}
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden
                border border-gray-200/80 dark:border-white/[0.08]
                text-gray-500 dark:text-white/50
                hover:bg-gray-50 dark:hover:bg-white/[0.04]
                transition-colors duration-150"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={menuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden
              border-t border-gray-200/50 dark:border-white/[0.06]
              bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">

              {LINKS.map((link, i) => {
                const active = isActive(link.path);
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-150
                        ${active
                          ? "text-white shadow-md"
                          : "text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                        }`}
                      style={active ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
                      } : {}}
                    >
                      <span className="text-base">{link.icon}</span>
                      {link.name}
                      {active && (
                        <HiSparkles className="ml-auto text-white/60 text-xs" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile search */}
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 pt-3 border-t border-gray-100 dark:border-white/[0.06]"
              >
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 text-sm pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search 70+ calculators..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl
                      border border-gray-200/80 bg-gray-50/80
                      dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/80
                      placeholder-gray-400 dark:placeholder-white/20
                      focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50
                      focus:ring-2 focus:ring-indigo-500/10
                      transition-all duration-200"
                  />
                </div>
              </motion.form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
}

export default memo(Navbar);