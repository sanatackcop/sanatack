import { Check, Star, Zap, Shield } from "lucide-react";
import React from "react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <div
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30 ${className}`}
  >
    {children}
  </div>
);

type FeatureListProps = {
  features: string[];
};

const FeatureList: React.FC<FeatureListProps> = ({ features }) => (
  <div className="space-y-4">
    {features.map((feature) => (
      <div key={feature} className="flex items-center gap-3">
        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <span className="text-slate-700 dark:text-gray-300">{feature}</span>
      </div>
    ))}
  </div>
);

type PricingCardProps = {
  title: string;
  description: string;
  price: string;
  popular?: boolean;
  features: string[];
  gradient?: boolean;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  popular = false,
  features,
  gradient = false,
}) => {
  const containerBase =
    "relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 flex-1 backdrop-blur-sm";
  const containerStyles = gradient
    ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl hover:shadow-2xl dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-500/50"
    : "bg-white/80 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl dark:bg-gray-900/50 dark:border-gray-800 dark:hover:border-gray-700";

  return (
    <div className={`${containerBase} ${containerStyles}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            الأكثر شعبية ⭐
          </div>
        </div>
      )}

      <div className="text-center mb-8 pt-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            gradient
              ? "bg-gradient-to-br from-blue-500 to-purple-600"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          {title === "مجاني" ? (
            <Star className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          ) : (
            <Shield className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm mb-6 text-slate-600 dark:text-gray-400">
          {description}
        </p>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {price}
          </span>
          <span className="text-lg mr-2 text-slate-600 dark:text-gray-400">
            ريال/شهر
          </span>
        </div>
        {title === "Pro" && (
          <p className="text-xs mb-6 text-slate-500 dark:text-gray-500">
            يُدفع سنوياً • وفر 20%
          </p>
        )}
        <button
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            gradient
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl text-white"
              : "bg-slate-900 hover:bg-slate-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
          }`}
        >
          {title === "مجاني" ? "ابدأ مجاناً" : "اشترك الآن"}
        </button>
      </div>

      <FeatureList features={features} />
    </div>
  );
};

export const HeroHeader: React.FC = () => (
  <div className="text-center mb-16 w-full max-w-4xl">
    <Badge>
      <Zap className="w-4 h-4" /> عزز معرفتك
    </Badge>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
      اختر الخطة التي
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {" "}
        تناسبك
      </span>
    </h1>
    <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
      ابدأ رحلتك مع خطة مجانية أو احصل على جميع الميزات المتقدمة مع الخطة
      الاحترافية
    </p>
  </div>
);

const Footer: React.FC = () => {
  const { darkMode } = useSettings();

  return (
    <footer className="w-full px-20 border-t border">
      <div className="flex flex-col md:flex-row justify-between items-center ">
        <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
          <img
            src={String(darkMode ? LogoDark : LogoLight)}
            alt="NearPay logo"
            className="w-32 h-auto filter transition-all duration-300 hover:brightness-110"
          />
        </div>

        <div className="flex items-center gap-4">
          {[
            { label: "X", href: "#" },
            { label: "in", href: "#" },
            { label: "@", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-600 text-slate-700 dark:text-white transition"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
