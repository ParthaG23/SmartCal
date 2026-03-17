import { memo, useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext  } from "../context/AuthContext";

import { FiMenu, FiX, FiSun, FiMoon, FiSearch,
         FiClock, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import { HiSparkles }  from "react-icons/hi2";
import { FaCalculator } from "react-icons/fa";

/* ── Nav links — History removed from main nav ── */
const LINKS = [
  { name: "Home",       path: "/"           },
  { name: "Categories", path: "/categories" },
  { name: "About",      path: "/about"      },
];

/* ── Avatar helper ── */
function Avatar({ user, size = "md" }) {
  const dim =
    size === "lg" ? "w-12 h-12" :
    size === "sm" ? "w-7 h-7"   : "w-9 h-9";

  const src =
    user.picture ||
    user.photo   ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "U")}&background=6366f1&color=fff&bold=true`;

  return (
    <img
      src={src}
      alt={user.name}
      onError={e => {
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "U")}&background=6366f1&color=fff&bold=true`;
      }}
      className={`${dim} rounded-full object-cover ring-2 ring-indigo-500/30`}
    />
  );
}

function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout }       = useContext(AuthContext);

  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const dropdownRef  = useRef(null);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close dropdown + mobile menu on route change */
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/");
  };

  /* show History link in main nav only when ON the history page */
  const onHistoryPage = pathname.startsWith("/history");

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

            {/* History link appears in nav only when on /history page */}
            {onHistoryPage && (
              <Link
                to="/history"
                className="relative px-4 py-2 rounded-xl text-sm font-medium
                  text-indigo-600 dark:text-indigo-400 transition-colors duration-150"
              >
                <motion.span
                  layoutId="navPill"
                  className="absolute inset-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/12"
                />
                <span className="relative flex items-center gap-1.5">
                  <FiClock size={13} />
                  History
                </span>
              </Link>
            )}

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

            {/* ── Guest buttons ── */}
            {!user && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-medium
                    text-gray-600 dark:text-white/60
                    hover:text-gray-900 dark:hover:text-white
                    transition-colors duration-150">
                  Login
                </Link>
                <Link to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl
                    bg-indigo-600 hover:bg-indigo-700
                    shadow-sm shadow-indigo-500/30
                    transition-all duration-200">
                  Sign up
                </Link>
              </div>
            )}

            {/* ── Profile dropdown ── */}
            {user && (
              <div className="relative" ref={dropdownRef}>

                {/* trigger */}
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 rounded-xl pl-1 pr-2.5 py-1
                    hover:bg-gray-100 dark:hover:bg-white/6
                    border border-transparent
                    hover:border-gray-200 dark:hover:border-white/10
                    transition-all duration-200"
                >
                  <Avatar user={user} size="sm" />
                  <span className="hidden md:block text-sm font-medium
                    text-gray-700 dark:text-white/80 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <FiChevronDown
                    size={13}
                    className={`hidden md:block text-gray-400 dark:text-white/30
                      transition-transform duration-200
                      ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* ── Dropdown panel ── */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1,    y: 0  }}
                      exit={{    opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72
                        bg-white dark:bg-[#111116]
                        border border-gray-200/80 dark:border-white/8
                        rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
                        overflow-hidden"
                    >

                      {/* profile header */}
                      <div className="relative px-5 py-5
                        bg-gradient-to-br from-indigo-50 to-purple-50/60
                        dark:from-indigo-500/8 dark:to-purple-500/5
                        border-b border-gray-100 dark:border-white/6">

                        <HiSparkles className="absolute top-4 right-4
                          text-indigo-300 dark:text-indigo-500/40 text-lg" />

                        <div className="flex items-center gap-3">
                          <Avatar user={user} size="lg" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white
                              truncate leading-tight">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-white/35
                              truncate mt-0.5">
                              {user.email}
                            </p>
                            <span className="mt-1.5 inline-flex items-center gap-1
                              rounded-full px-2 py-0.5
                              bg-green-100 dark:bg-green-500/12
                              text-[10px] font-semibold
                              text-green-600 dark:text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500
                                animate-pulse inline-block" />
                              Signed in
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* menu items */}
                      <div className="p-2">

                        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold
                          uppercase tracking-widest
                          text-gray-400 dark:text-white/20">
                          Account
                        </p>

                        {/* ✅ History now lives here in the dropdown */}
                        <Link
                          to="/history"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                            text-sm text-gray-600 dark:text-white/60
                            hover:bg-gray-50 dark:hover:bg-white/5
                            hover:text-gray-900 dark:hover:text-white/90
                            transition-colors duration-150 group"
                        >
                          <span className="flex h-8 w-8 items-center justify-center
                            rounded-lg bg-indigo-50 dark:bg-indigo-500/10
                            text-indigo-500 dark:text-indigo-400
                            group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20
                            transition-colors duration-150">
                            <FiClock size={14} />
                          </span>
                          <div>
                            <p className="font-medium leading-tight">
                              Calculation History
                            </p>
                            <p className="text-[11px] text-gray-400
                              dark:text-white/25 leading-tight">
                              View past calculations
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                            text-sm text-gray-600 dark:text-white/60
                            hover:bg-gray-50 dark:hover:bg-white/5
                            hover:text-gray-900 dark:hover:text-white/90
                            transition-colors duration-150 group"
                        >
                          <span className="flex h-8 w-8 items-center justify-center
                            rounded-lg bg-purple-50 dark:bg-purple-500/10
                            text-purple-500 dark:text-purple-400
                            group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20
                            transition-colors duration-150">
                            <FiUser size={14} />
                          </span>
                          <div>
                            <p className="font-medium leading-tight">Profile</p>
                            <p className="text-[11px] text-gray-400
                              dark:text-white/25 leading-tight">
                              Manage your account
                            </p>
                          </div>
                        </Link>

                      </div>

                      {/* logout */}
                      <div className="p-2 pt-0">
                        <div className="border-t border-gray-100 dark:border-white/6 mb-2" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl
                            text-sm font-medium text-red-500 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-500/8
                            transition-colors duration-150 group"
                        >
                          <span className="flex h-8 w-8 items-center justify-center
                            rounded-lg bg-red-50 dark:bg-red-500/10
                            group-hover:bg-red-100 dark:group-hover:bg-red-500/20
                            transition-colors duration-150">
                            <FiLogOut size={14} />
                          </span>
                          <div className="text-left">
                            <p className="leading-tight">Sign out</p>
                            <p className="text-[11px] text-red-400/70
                              dark:text-red-400/40 leading-tight font-normal">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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

              {/* History in mobile menu too when on history page */}
              {onHistoryPage && (
                <Link
                  to="/history"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                    font-medium bg-indigo-50 dark:bg-indigo-500/12
                    text-indigo-600 dark:text-indigo-400"
                >
                  <FiClock size={13} />
                  History
                </Link>
              )}

              <div className="mt-2 pt-3 border-t border-gray-100 dark:border-white/6">
                {!user ? (
                  <div className="flex gap-2">
                    <Link to="/login"
                      className="flex-1 py-2.5 text-center text-sm font-medium
                        text-gray-700 dark:text-white/70
                        border border-gray-200 dark:border-white/10 rounded-xl">
                      Login
                    </Link>
                    <Link to="/signup"
                      className="flex-1 py-2.5 text-center text-sm font-semibold
                        text-white bg-indigo-600 rounded-xl">
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 px-1">
                      <Avatar user={user} size="sm" />
                      <div>
                        <p className="text-sm font-medium
                          text-gray-900 dark:text-white/90">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white/30">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* History shortcut in mobile for logged-in users */}
                    <Link
                      to="/history"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                        text-sm font-medium
                        text-gray-600 dark:text-white/60
                        hover:bg-gray-50 dark:hover:bg-white/5
                        transition-colors duration-150"
                    >
                      <FiClock size={14} />
                      Calculation History
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2
                        px-3 py-2.5 rounded-xl text-sm font-medium
                        text-red-500 hover:bg-red-50 dark:hover:bg-red-500/8
                        transition-colors duration-150"
                    >
                      <FiLogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
}

export default memo(Navbar);