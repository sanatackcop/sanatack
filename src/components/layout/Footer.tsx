import React from "react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  const { darkMode } = useSettings();
  const { t } = useTranslation();

  const links = [
    { label: t("footer.blogs"), href: "#" },
    { label: t("footer.terms"), href: "#" },
    { label: t("footer.privacy"), href: "#" },
    { label: t("footer.contact"), href: "#" },
  ];

  const socialLinks = [
    {
      icon: <FaXTwitter className="w-5 h-5" />,
      href: "https://twitter.com/sanatack",
      label: t("footer.twitter"),
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: "https://linkedin.com/company/sanatack",
      label: t("footer.linkedin"),
    },
    {
      icon: <FaDiscord className="w-5 h-5" />,
      href: "#",
      label: t("footer.discord"),
    },
  ];

  return (
    <>
      <div className="dark:bg-zinc-950 bg-zinc-50">
        <footer id="footer" className="dark:bg-zinc-95">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-around gap-6 lg:gap-8">
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex-shrink-0 transition-transform duration-300">
                  <img
                    src={String(darkMode ? LogoDark : LogoLight)}
                    alt="Santack logo"
                    className="size-20 filter transition-all duration-300 opacity-85 hover:opacity-100 hover:brightness-110"
                  />
                </div>
              </div>

              <nav className="flex-wrap hidden items-center justify-center gap-x-6 gap-y-2">
                {links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200 whitespace-nowrap"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`p-2.5 rounded-lg  duration-300 transition-all ease-linear${
                      darkMode
                        ? "bg-zinc-800 hover:bg-zinc-600 text-gray-300"
                        : "bg-gray-100 hover:bg-zinc-500 text-gray-700 hover:text-white"
                    }`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
