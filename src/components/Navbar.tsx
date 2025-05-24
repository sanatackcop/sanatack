import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { CircleArrowLeft, Moon, Sun, Menu, X } from "lucide-react";

import { navItems } from "@/utils/navList";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sharedNavClass =
    "relative transition-all duration-300 font-medium text-sm hover:scale-105 hover:text-primary-500 dark:hover:text-primary-400 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-primary-500 before:to-primary-400 before:transition-all before:duration-300 hover:before:w-full";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-500 ease-out border-b",
        isScrolled
          ? "backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 py-2 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50"
          : "py-4 bg-gradient-to-b from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link
          to="/"
          className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <img
            src={String(darkMode ? LogoDark : LogoLight)}
            alt="NearPay logo"
            className="w-28 h-auto filter transition-all duration-300 hover:brightness-110"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map(({ title, href, icon: Icon, isActive }) => (
            <NavLink
              key={title}
              to={href}
              className={({ isActive: active }) =>
                clsx(
                  sharedNavClass,
                  active || isActive
                    ? "text-gray-900 dark:text-white before:w-full"
                    : "text-gray-600 dark:text-gray-300"
                )
              }
            >
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                )}
                <span>{title}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            className="relative rounded-full h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-gray-900
             dark:hover:text-white transition-all duration-300 hover:scale-110 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 group"
          >
            <div className="relative">
              {darkMode ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500" />
              ) : (
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-all duration-500" />
              )}
            </div>
          </Button>

          <Button
            asChild
            size="sm"
            className="group relative overflow-hidden
            from-primary-600 to-primary-500 hover:from-primary-700
            hover:to-primary-600 text-white  hover:shadow-xl
             transition-all duration-300 hover:scale-105 px-6 py-2 rounded-full"
          >
            <Link to="/login" className="flex items-center gap-2 relative z-10">
              <span className="font-medium">التسجيل</span>
              <CircleArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <Button
          onClick={() => setIsMenuOpen((open) => !open)}
          variant="ghost"
          size="icon"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          className="md:hidden relative h-10 w-10 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
        >
          <div className="relative">
            <button
              aria-label="Toggle navigation"
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors
               text-black dark:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>{" "}
          </div>
        </Button>
      </div>

      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-500 ease-out",
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-4 mt-4 mb-2 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <ul className="flex flex-col p-6 space-y-2">
            {navItems.map(({ title, href, icon: Icon }, idx) => (
              <li key={idx}>
                <Link
                  to={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-all duration-300 group"
                >
                  {Icon && (
                    <Icon className="h-5 w-5 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="font-medium">{title}</span>
                </Link>
              </li>
            ))}

            <li className="pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={toggleDarkMode}
                  variant="ghost"
                  size="sm"
                  aria-label="Toggle dark mode"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-all duration-300"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 text-white" />
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-black" />
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-xl"
                >
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <span className="font-medium">التسجيل</span>
                    <CircleArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
