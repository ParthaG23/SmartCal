import { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";



import { FiSearch, FiX, FiHome, FiFolder, FiInfo, FiMenu } from "react-icons/fi";

/* ── Nav links — using clean react-icons instead of emoji ── */
const LINKS = [
  { name: "Home",       path: "/",           Icon: FiHome,   sub: "Explore all calculators" },
  { name: "Categories", path: "/categories", Icon: FiFolder, sub: "Browse by topic"         },
  { name: "About",      path: "/about",      Icon: FiInfo,   sub: "Our mission & team"      },
];

function Navbar() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [search,        setSearch]        = useState("");
  const [scrolled,      setScrolled]      = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);



  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const searchRef    = useRef(null);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    searchRef.current?.blur();
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-200/60 dark:border-white/[0.06] bg-white/75 dark:bg-[#09090b]/80 backdrop-blur-2xl shadow-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 xl:px-16">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link to="/" className="group flex items-center gap-2.5 shrink-0">
                <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20"
              >
                <img 
                  src="/logo.png" 
                  alt="CalcVision Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white/95">
                  Calc
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #ec4899)" }}
                  >
                    Vision
                  </span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] leading-none text-gray-400 dark:text-white/20 hidden sm:block">
                  Smart Calculator
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-0.5 p-1 rounded-2xl bg-gray-100/70 dark:bg-white/[0.04] border border-gray-200/50 dark:border-white/[0.06]">
              {LINKS.map(({ name, path }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={name}
                    to={path}
                    className={`relative px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 select-none ${
                      active
                        ? "text-white"
                        : "text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-2">

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
                <FiSearch
                  className={`absolute left-3 text-sm pointer-events-none transition-colors duration-200 ${
                    searchFocused ? "text-indigo-500" : "text-gray-400 dark:text-white/25"
                  }`}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search 70+ calculators..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-56 pl-9 pr-3 py-2 text-[13px] rounded-xl border bg-gray-50/80 dark:bg-white/[0.03] dark:text-white/80 placeholder-gray-400 dark:placeholder-white/20 focus:outline-none transition-all duration-300 ${
                    searchFocused
                      ? "w-72 border-indigo-400 dark:border-indigo-500/50 ring-2 ring-indigo-500/15 shadow-lg shadow-indigo-500/5"
                      : "border-gray-200/80 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10"
                  }`}
                />
                {search && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 pointer-events-none"
                  >
                    ↵
                  </motion.span>
                )}
              </form>



              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMenuOpen((o) => !o)}
                whileTap={{ scale: 0.9 }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl md:hidden border transition-all duration-200 ${
                  menuOpen
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400"
                    : "border-gray-200/80 dark:border-white/[0.08] text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                }`}
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
      </motion.header>

      {/* ── Mobile overlay + premium panel ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Dropdown panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden"
              style={{
                background: "rgba(9,9,11,0.97)",
                borderBottom: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="px-4 pt-5 pb-6">

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-3 mb-5 px-3.5 py-2.5 rounded-2xl transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <FiSearch className="text-white/30 text-sm shrink-0" />
                  <input
                    type="text"
                    placeholder="Search 70+ calculators…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-white/75 placeholder-white/25"
                    style={{ fontFamily: "inherit" }}
                  />
                  {search && (
                    <span className="text-[10px] font-bold text-indigo-400">↵</span>
                  )}
                </form>

                {/* Section label */}
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20 px-1 mb-2">
                  Navigate
                </p>

                {/* Nav items */}
                <div className="flex flex-col gap-1">
                  {LINKS.map(({ name, path, Icon, sub }, i) => {
                    const active = isActive(path);
                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.055, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          to={path}
                          className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 relative overflow-hidden"
                          style={
                            active
                              ? {
                                  background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.1))",
                                  border: "0.5px solid rgba(99,102,241,0.28)",
                                }
                              : {
                                  border: "0.5px solid transparent",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "transparent";
                            }
                          }}
                        >
                          {/* Active left accent */}
                          {active && (
                            <span
                              className="absolute left-0 top-[22%] bottom-[22%] w-[3px] rounded-r-full"
                              style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }}
                            />
                          )}

                          {/* Icon tile */}
                          <span
                            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl transition-all duration-200"
                            style={
                              active
                                ? {
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
                                    border: "0.5px solid rgba(99,102,241,0.4)",
                                  }
                                : {
                                    background: "rgba(255,255,255,0.05)",
                                    border: "0.5px solid rgba(255,255,255,0.08)",
                                  }
                            }
                          >
                            <Icon
                              size={16}
                              style={{ color: active ? "#a5b4fc" : "rgba(255,255,255,0.55)" }}
                            />
                          </span>

                          {/* Text */}
                          <span className="flex flex-col flex-1 min-w-0">
                            <span
                              className="text-[14px] font-semibold leading-tight"
                              style={{ color: active ? "#a5b4fc" : "rgba(255,255,255,0.85)" }}
                            >
                              {name}
                            </span>
                            <span
                              className="text-[11px] mt-0.5 truncate"
                              style={{ color: "rgba(255,255,255,0.28)" }}
                            >
                              {sub}
                            </span>
                          </span>

                          {/* Chevron */}
                          <span
                            className="text-[15px] font-light shrink-0"
                            style={{ color: active ? "rgba(165,180,252,0.5)" : "rgba(255,255,255,0.18)" }}
                          >
                            ›
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(Navbar);