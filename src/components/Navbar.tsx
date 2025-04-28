import { useEffect, useState } from "react";
import { navItems } from "@/utils/navList";
import { Link } from "react-router-dom";
import LogoLight from "../assets/logo.svg";
import { CircleArrowLeft, Moon, Sun, Menu, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import { Button } from "./ui/button";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav
      className={`fixed inset-x-0 top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-lg bg-black/70 dark:bg-[#0C0C0C]/70 py-2 rounded-b--3xl  shadow-lg"
          : "bg-white dark:bg-black py-2"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 bg-none">
        <Link to="/" className="flex-shrink-0">
          <img
            src={String(LogoLight)}
            alt="logo"
            className={`transition-all duration-300 ${
              isScrolled ? "w-24" : "w-32"
            }`}
          />
        </Link>

        <div className="hidden md:flex items-center space-x-5 space-x-reverse bg-[#0C0C0C] border border-[#222222] rounded-full h-14 pr-5 pl-2">
          {navItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.isActive ? item.href : ""}
              className={`text-white hover:text-[#888888] text-sm font-medium text-nowrap ${
                !item.isActive ? "text-gray-600 text-opacity-50" : ""
              } hover:text-gray-300 transition-colors cursor-pointer ${
                index === navItems.length - 1
                  ? "bg-[#181818] border text-[#888888] border-[#2B2B2B] text-nowrap rounded-full h-10 w-32 gap-2 flex items-center justify-center"
                  : ""
              }`}
            >
              {item.icon && <item.icon className="h-4 w-4" />} {item.title}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="rounded-full p-2 text-black dark:text-white hover:bg-white/10 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Button
            className="w-full h-full bg-none dark:bg-transparent transition-all
              ease-in-out duration-700 dark:hover:bg-transparent dark:hover:opacity-50
              rounded-full bg-transparent"
          >
            <Link
              to={"/login"}
              className="flex items-center gap-2 text-black dark:text-white "
            >
              التسجيل
              <CircleArrowLeft
                className="transition-transform 
                duration-300 group-hover:rotate-45"
              />
            </Link>
          </Button>
        </div>

        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-4 p-4 bg-[#0C0C0C] dark:bg-[#181818] rounded-b-2xl">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white text-lg"
              >
                {item.icon && <item.icon className="h-5 w-5" />} {item.title}
              </Link>
            </li>
          ))}

          <li className="flex items-center justify-between mt-6">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="flex items-center gap-2"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/login"
              className="flex items-center gap-1 text-white bg-[#181818] border border-[#2B2B2B] rounded-full px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              التسجيل <CircleArrowLeft className="w-4 h-4" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
