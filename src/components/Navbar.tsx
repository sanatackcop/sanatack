import { useState } from "react";
import { navItems } from "@/utils/navList";
import { Link } from "react-router-dom";
import LogoLight from "../assets/logo.svg";
import LogoDark from "../assets/lightmood.svg";
import Dark from "../assets/logodark2.png";
import Logo from "../assets/logo1.png";
import { CircleArrowLeft, Moon, Sun } from "lucide-react";
import { useSettings } from "../context/SettingsContexts";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className=" relative w-full lg:px-0 z-50 bg-white dark:bg-black">
      <div className="max-w-full mx-auto flex justify-between items-center px-4  ">
        
      
        <div className="flex-shrink-0">
          <img
            src={darkMode ? String(Dark) : String(LogoDark)}
            alt="logo"
            className={`object-contain transition-all duration-300 ${
              darkMode
                ? "h-[90px] md:h-[150px]"
                : "h-[90px] md:h-[150px]"
            }`}
          />
        </div>

       
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

       
        <div className="hidden md:flex pl-10 items-center justify-center pr-4 gap-4">
  
        <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-full  
                        
                      
                      text-gray-800 dark:text-white 
                      hover:transition-all duration-900"
            aria-label="Toggle Dark Mode"
          >
          
            <span className="text-lg">
              {darkMode ? <Sun/> : <Moon/>}
            </span>
          </button>


 
          <Link to="/login">
            <div className="flex items-center gap-2 px-6 py-2 bg-[#181818] border border-[#2B2B2B] 
                            text-white rounded-full hover:bg-[#2B2B2B] transition duration-300 shadow-md">
              <span className="text-sm font-medium">التسجيل</span>
              <CircleArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </div>
          </Link>
        </div>


       
        <div className="md:hidden ">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black dark:text-white focus:outline-none"
          >
            {isMenuOpen ? (
              
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      
      {isMenuOpen && (
        <div className="md:hidden  w-full bg-white dark:bg-[#0C0C0C] shadow-md py-4 z-999 border-t border-gray-200 dark:border-[#222]">
          <div className="flex flex-col items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-black dark:text-white hover:text-gray-500 text-sm font-medium ${
                  !item.isActive ? "text-gray-400" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}

            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <div className="px-6 py-2 bg-black text-white rounded-full">
                التسجيل
              </div>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-full 
                         bg-gray-200 dark:bg-[#2B2B2B] text-black dark:text-white 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
            >
              {darkMode ? <Sun/> : <Moon/>}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
