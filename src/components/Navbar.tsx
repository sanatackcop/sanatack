import { useEffect, useState } from "react";
import { navItems } from "@/utils/navList";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import LogoLight from "../assets/logo.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [language] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  console.log(toggleDarkMode);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <nav className="bg-transparent px-6 lg:px-0">
      <div className="max-w-full mx-auto flex justify-around items-center">
        <img
          src={isDarkMode ? String(LogoLight) : String(LogoLight)}
          alt="logo"
          width={180}
        />

        <div className="hidden md:flex items-center space-x-5 space-x-reverse bg-[#0C0C0C] border border-[#222222] rounded-full h-14 pr-5 pl-2">
          {navItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.isActive ? item.href : ""}
              className={`text-white hover:text-[#888888] text-sm font-medium ${
                !item.isActive ? "text-gray-600 text-opacity-50" : ""
              } hover:text-gray-300 transition-colors cursor-pointer ${
                index === navItems.length - 1
                  ? "bg-[#181818] border text-[#888888] border-[#2B2B2B] rounded-full h-10 w-24 gap-2 flex items-center justify-center"
                  : ""
              }`}
            >
              {item.icon && <item.icon className="h-4 w-4" />} {item.title}
            </Link>
          ))}
        </div>

        <Button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        <div className="hidden md:flex pl-10 items-center justify-center pr-4">
          {/* Language toggle button */}
          {/* <Button
            onClick={toggleLanguage}
            className="flex items-center justify-center hover:opacity-75 bg-none hover:bg-transparent dark:bg-transparent bg-transparent border-none
            text-sm font-medium rounded-full h-10 w-10 dark:hover:bg-transparent dark:hover:opacity-75
            transition-colors duration-500 shadow-none"
            aria-label="Toggle Language"
          >
            <div className="text-black dark:text-white flex pr-2 pl-5 items-center gap-1">
              <Globe className="w-5 h-5 mr-2" />{" "}
              {language === "en" ? (
                <p className="">AR</p>
              ) : (
                <p className="">EN</p>
              )}
            </div>
          </Button> */}

          {/* Dark mode toggle button */}
          {/* <Button
            onClick={toggleDarkMode}
            className="flex items-center justify-center hover:opacity-75 bg-none hover:bg-transparent dark:bg-transparent bg-transparent border-none
            text-sm font-medium rounded-full h-10 w-10 dark:hover:bg-transparent dark:hover:opacity-75
            transition-colors duration-500 shadow-none"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <SunIcon className="text-white w-5 h-5" />
            ) : (
              <MoonIcon className="text-black w-5 h-5 bg-none" />
            )}
          </Button> */}
          {/* <div
            className="flex items-center bg-black border
             border-[#9191915b] group rounded-full relative"
            style={{ width: "170px", height: "40px" }}
          >
            <div
              className="rounded-full border-[#919191] border flex items-center justify-center transition-transform duration-300"
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "#0C0C0C",
                boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Button className="w-full h-full text-center dark:bg-transparent dark:hover:bg-transparent text-white text-sm font-medium rounded-full hover:opacity-75 flex items-center justify-center transition-transform duration-300">
                <Link to={"/signup"} className="flex items-center text-white">
                  اشترك
                </Link>
              </Button>
            </div>

            <Button
              className="w-full h-full bg-none dark:bg-transparent transition-all
              ease-in-out duration-700 dark:hover:bg-transparent dark:hover:opacity-50
              rounded-full bg-transparent"
            >
              <Link to={"/login"} className="flex items-center text-white">
                التسجيل
                <CircleArrowLeft
                  className="transition-transform 
                duration-300 group-hover:rotate-45"
                />
              </Link>
          </Button>
          </div> */}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 bg-[#0C0C0C] border border-[#222222] rounded-lg p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.isActive ? item.href : ""}
              className={`block text-white hover:text-[#888888] text-sm font-medium ${
                !item.isActive ? "text-gray-600 text-opacity-50" : ""
              } hover:text-gray-300 transition-colors`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
