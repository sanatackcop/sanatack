import { navItems } from "@/utils/navList";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import LogoLight from "../assets/logo.svg";
import { CircleArrowLeft } from "lucide-react";
import { useSettings } from "../context/SettingsContexts";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useSettings();

  return (
    <nav className=" lg:px-0">
      <div className="max-w-full mx-auto flex justify-around items-center">
        <div className="flex-shrink-0">
          <img
            className="w-[120px] md:w-[180px] cursor-pointer"
            src={String(LogoLight)}
            alt="logo"
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

        {/* <div className="hidden md:flex pl-10 items-center justify-center pr-4">
          <div
            className="flex items-center bg-black border
             border-[#9191915b] group rounded-full relative"
            style={{ width: "120px", height: "50px" }}
          >
            <Button
              className="w-full h-full bg-none dark:bg-transparent transition-all
              ease-in-out duration-700 dark:hover:bg-transparent dark:hover:opacity-50
              rounded-full bg-transparent"
            >
              <Link
                to={"/login"}
                className="flex items-center gap-2 text-white"
              >
                التسجيل
                <CircleArrowLeft
                  className="transition-transform 
                duration-300 group-hover:rotate-45"
                />
              </Link>
            </Button>
          </div>
        </div> */}

<div className="hidden md:flex pl-10 items-center justify-center pr-4 gap-4">
  {/* زر التسجيل */}
  <div
    className="flex items-center bg-black border border-[#9191915b] group rounded-full relative"
    style={{ width: "120px", height: "50px" }}
  >
    <Button
      className="w-full h-full bg-none dark:bg-transparent transition-all
      ease-in-out duration-700 dark:hover:bg-transparent dark:hover:opacity-50
      rounded-full bg-transparent"
    >
      <Link to={"/login"} className="flex items-center gap-2 text-white">
        التسجيل
        <CircleArrowLeft className="transition-transform duration-300 group-hover:rotate-45" />
      </Link>
    </Button>
  </div>

  {/* زر الوضع الليلي */}
  <button
    onClick={toggleDarkMode}
    className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 
             text-sm text-black dark:text-white transition"
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</div>

      </div>

      
    </nav>
  );
};

export default Navbar;
