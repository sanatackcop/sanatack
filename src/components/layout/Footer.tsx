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
      href: "https://twitter.com/youlearn",
      label: t("footer.twitter"),
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: "https://linkedin.com/company/youlearn",
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
        <section className="pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-zinc-800/70 border border-gray-200/50 dark:border-zinc-700/50 rounded-2xl p-12 md:p-16 text-center shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-transparent to-zinc-200/50 dark:from-zinc-700/30 dark:via-transparent dark:to-zinc-600/30"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {t("cta.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                  {t("cta.subtitle")}
                </p>
                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  {t("cta.button")}
                </button>
              </div>
            </div>
          </div>
        </section>

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

              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
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
