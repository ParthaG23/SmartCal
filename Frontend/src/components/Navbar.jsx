import { memo, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";

const LINKS = [
{ name: "Home", path: "/" },
{ name: "Categories", path: "/categories" },
{ name: "History", path: "/history" },
{ name: "About", path: "/about" },
];

function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [search, setSearch] = useState("");

const { theme, toggleTheme } = useContext(ThemeContext);
const { pathname } = useLocation();
const navigate = useNavigate();

const isActive = (path) =>
path === "/" ? pathname === "/" : pathname.startsWith(path);

const handleSearch = (e) => {
e.preventDefault();
if (!search.trim()) return;
navigate(`/?search=${encodeURIComponent(search)}`);
setSearch("");
};

return (
<motion.header
initial={{ y: -60, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.4 }}
className="
sticky top-0 z-50
border-b border-gray-200/70 dark:border-white/6
bg-white/75 dark:bg-[#09090b]/80
backdrop-blur-xl
"
> <div className="w-full px-6 xl:px-16">


    <div className="flex h-16 items-center justify-between">

      {/* Logo */}
      <Link to="/" className="group flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 transition-transform group-hover:scale-105">
          <FaCalculator className="text-sm text-indigo-600 dark:text-indigo-400" />
        </div>

        <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white/90">
          Smart<span className="text-indigo-600 dark:text-indigo-400">Calc</span>
        </span>
      </Link>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {LINKS.map((link) => {
          const active = isActive(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                relative px-4 py-2 rounded-xl text-sm font-medium
                transition-colors duration-150
                ${
                  active
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-white/45 hover:text-gray-900 dark:hover:text-white/80"
                }
              `}
            >
              {active && (
                <motion.span
                  layoutId="navPill"
                  className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/12"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <span className="relative">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3">

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center relative"
        >
          <FiSearch className="absolute left-3 text-gray-400 text-sm" />

          <input
            type="text"
            placeholder="Search calculators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-56 pl-9 pr-3 py-2
              text-sm rounded-xl
              border border-gray-200 bg-white
              text-gray-800 placeholder-gray-400
              outline-none transition
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
              dark:border-white/10 dark:bg-[#111116]
              dark:text-white/90 dark:placeholder-white/30
            "
          />
        </form>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            flex h-9 w-9 items-center justify-center rounded-xl
            border border-gray-200 bg-white text-gray-500
            transition-all duration-150
            hover:border-gray-300 hover:text-gray-700
            dark:border-white/8 dark:bg-white/5 dark:text-white/45
            dark:hover:border-white/15 dark:hover:text-white/70
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              {theme === "dark" ? (
                <FiSun className="text-sm" />
              ) : (
                <FiMoon className="text-sm" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="
            flex h-9 w-9 items-center justify-center rounded-xl
            border border-gray-200 bg-white text-gray-500 md:hidden
            transition-all duration-150
            hover:border-gray-300 hover:text-gray-700
            dark:border-white/8 dark:bg-white/5 dark:text-white/45
          "
        >
          {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

    </div>
  </div>

  {/* Mobile menu */}
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden border-t border-gray-100 dark:border-white/6 md:hidden"
      >
        <div className="flex flex-col gap-1 px-4 py-3">

          {LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 dark:text-white/60 dark:hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}

        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.header>


);
}

export default memo(Navbar);
