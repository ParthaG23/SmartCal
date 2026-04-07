import { memo, useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";

/* ── Nav links ── */
const LINKS = [
  { name: "Home",       path: "/"           },
  { name: "Categories", path: "/categories" },
  { name: "About",      path: "/about"      },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search,   setSearch]   = useState("");

  const { theme, toggleTheme } = useContext(ThemeContext);

  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  /* close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50
        border-b border-gray-200/70 dark:border-white/6
        bg-white/80 dark:bg-[#09090b]/85
        backdrop-blur-xl"
    >
      <div className="w-full px-6 xl:px-16">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg
              bg-indigo-50 dark:bg-indigo-500/15
              group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/25
              transition-colors duration-200">
              <FaCalculator className="text-sm text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-[15px] font-bold tracking-tight
              text-gray-900 dark:text-white/90">
             Calc<span className="text-indigo-600 dark:text-indigo-400">Vision</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium
                    transition-colors duration-150
                    ${active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-white/45 hover:text-gray-900 dark:hover:text-white/80"
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/12"
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <form onSubmit={handleSearch}
              className="hidden lg:flex items-center relative">
              <FiSearch className="absolute left-3 text-gray-400 text-sm pointer-events-none" />
              <input
                type="text"
                placeholder="Search calculators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 pl-9 pr-3 py-2 text-sm rounded-xl
                  border border-gray-200 bg-gray-50
                  dark:border-white/10 dark:bg-white/5 dark:text-white/80
                  placeholder-gray-400 dark:placeholder-white/25
                  focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500/60
                  focus:ring-2 focus:ring-indigo-500/15
                  transition-all duration-200"
              />
            </form>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl
                border border-gray-200 bg-white text-gray-500
                dark:border-white/8 dark:bg-white/5 dark:text-white/50
                hover:text-gray-900 dark:hover:text-white/80
                hover:border-gray-300 dark:hover:border-white/15
                transition-all duration-200"
            >
              {theme === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            {/* ── Mobile menu button ── */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden
                text-gray-500 dark:text-white/50
                hover:bg-gray-100 dark:hover:bg-white/6
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
            </button>

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
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-gray-100 dark:border-white/6
              bg-white dark:bg-[#09090b] md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">

              {LINKS.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-colors duration-150
                      ${active
                        ? "bg-indigo-50 dark:bg-indigo-500/12 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mt-2 pt-3 border-t border-gray-100 dark:border-white/6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search calculators..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl
                      border border-gray-200 bg-gray-50
                      dark:border-white/10 dark:bg-white/5 dark:text-white/80
                      placeholder-gray-400 dark:placeholder-white/25
                      focus:outline-none focus:border-indigo-400
                      transition-all duration-200"
                  />
                </div>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
}

export default memo(Navbar);