import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { Moon, Sun, Languages, CircleArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { navItems } from "@/utils/navList";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "@/context/SettingsContexts";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";
import StarBorder from "./blocks/Animations/StarBorder/StarBorder";

const NAV_LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const Navbar = () => {
  const { darkMode, toggleDarkMode, language, setLanguage } = useSettings();
  const { t } = useTranslation();
  const { direction } = useLocaleDirection();

  return (
    <nav
      dir={direction}
      className="sticky top-0 z-50 w-full border-b
       border-gray-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-[#09090b]"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="flex-shrink-0  transition-transform duration-300"
          >
            <img
              src={String(darkMode ? LogoDark : LogoLight)}
              alt="Santack logo"
              className="w-28 h-auto filter transition-all duration-300 opacity-85 hover:opacity-100 hover:brightness-110"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ title, href }) => (
              <NavLink
                key={title}
                to={href}
                className={clsx(
                  "group relative flex items-center rounded-xl gap-2 px-3 py-2  text-sm  transition-all duration-500  hover:text-zinc-900 hover:dark:text-white hover:bg-gray-100 hover:dark:bg-zinc-800 "
                )}
              >
                <span>{t(title as any)}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white
                 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                aria-label="Change language"
              >
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[160px] space-y-1"
            >
              {NAV_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => setLanguage(lang.code)}
                  className={clsx(
                    "flex items-center py-2 cursor-pointer",
                    language === lang.code && "bg-gray-100 dark:bg-zinc-800"
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {language === lang.code && (
                    <span className="ms-auto text-xs text-zinc-500">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            className="size-9 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
            transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <StarBorder
            className="group"
            inputClassName="bg-gradient-to-b from-[#09080b] to-[#09080b]  border 
  border-zinc-800 dark:border-zinc-700 rounded-lg 
  duration-300 transition-all ease-linear"
            size="sm"
          >
            <Link
              to="/signup"
              className="flex items-center gap-2 relative z-10"
            >
              <span className="text-sm text-white transition-all duration-300 ease-linear">
                {t("nav.getStarted")}
              </span>

              <CircleArrowLeft className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45 group-hover:-translate-x-1" />
            </Link>
          </StarBorder>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
