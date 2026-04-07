import { Link } from "react-router-dom";
import { FaCalculator, FaGithub,  FaLinkedin } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const LINKS = {
  Calculators: [
    { label: "BMI",               to: "/calculator/bmi"              },
    { label: "EMI",               to: "/calculator/emi"              },
    { label: "SIP",               to: "/calculator/sip"              },
    { label: "GST",               to: "/calculator/gst"              },
    { label: "Quadratic",         to: "/calculator/quadratic"        },
    { label: "Ohm's Law",         to: "/calculator/ohms-law"         },
    { label: "Discount",          to: "/calculator/discount"         },
    { label: "Sleep Cycle",       to: "/calculator/sleep-cycle"      },
    { label: "Fuel Cost",         to: "/calculator/fuelCost"         },
  ],
  Categories: [
    { label: "Finance",  to: "/categories?category=Finance"  },
    { label: "Health",   to: "/categories?category=Health"   },
    { label: "Math",     to: "/categories?category=Math"     },
    { label: "Science",  to: "/categories?category=Science"  },
    { label: "Shopping", to: "/categories?category=Shopping" },
    { label: "Personal", to: "/categories?category=Personal" },
    { label: "Travel",   to: "/categories?category=Travel"   },
  ],
  Product: [
    { label: "Home",    to: "/"        },
    { label: "About",   to: "/about"   },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="
      mt-20 border-t
      border-gray-200/80 dark:border-white/6
      bg-white dark:bg-[#09090b]
    ">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 transition-transform duration-200 group-hover:scale-105">
                <FaCalculator className="text-sm text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white/90">
                CalcVision
              </span>
            </Link>

            <p className="text-[13px] leading-relaxed text-gray-400 dark:text-white/35 max-w-[200px]">
              Precision calculators for finance, health, math and everyday decisions.
            </p>

            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com/ParthaG23"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-700 dark:border-white/8 dark:text-white/30 dark:hover:border-white/15 dark:hover:text-white/60"
              >
                <FaGithub className="text-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/partha-gayen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-700 dark:border-white/8 dark:text-white/30 dark:hover:border-white/15 dark:hover:text-white/60"
              >
                <FaLinkedin className="text-sm" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[13px] text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/80 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[12px] text-gray-400 dark:text-white/25">
            © {year} CalcVision. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-white/25">
            Made with <HiSparkles className="text-indigo-500 dark:text-indigo-400 text-xs" /> for smart decisions
          </p>
        </div>
      </div>
    </footer>
  );
}
