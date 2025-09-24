import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Zap, Crown, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeBannerProps {
  title?: string;
  description?: string;
  percentage?: number;
  currentUsage?: number;
  maxLimit?: number;
  variant?: "warning" | "premium" | "info" | "success";
  icon?: "zap" | "crown" | "star";
  canClose?: boolean;
  showProgressBar?: boolean;
  onClose?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

const UpgradeBanner = ({
  title,
  description,
  percentage = 26,
  currentUsage = 26,
  maxLimit = 100,
  variant = "warning",
  icon = "zap",
  canClose = true,
  showProgressBar = true,
  onClose,
  className = "",
}: UpgradeBannerProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const variants = {
    warning: {
      bgClass: "bg-yellow-200/70",
      textClass: "text-yellow-900",
      iconClass: "text-yellow-800",
      progressBg: "bg-yellow-200/40",
      progressFill: "bg-yellow-800/80",
    },
    premium: {
      bgClass: "bg-purple-500",
      textClass: "text-white",
      iconClass: "text-purple-100",
      progressBg: "bg-white/20",
      progressFill: "bg-white/90",
    },
    info: {
      bgClass: "bg-blue-500",
      textClass: "text-white",
      iconClass: "text-blue-100",
      progressBg: "bg-white/20",
      progressFill: "bg-white/90",
    },
    success: {
      bgClass: "bg-green-500",
      textClass: "text-white",
      iconClass: "text-green-100",
      progressBg: "bg-white/20",
      progressFill: "bg-white/90",
    },
  };

  const icons = {
    zap: Zap,
    crown: Crown,
    star: Star,
  };

  const IconComponent = icons[icon];
  const currentVariant = variants[variant];

  const defaultTitle = title || t("upgradeBanner.title", "Upgrade");
  const defaultDescription =
    description || t("upgradeBanner.description", "Get access to all features");

  // Calculate actual percentage if not provided
  const actualPercentage =
    percentage || Math.round((currentUsage / maxLimit) * 100);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`relative ${currentVariant.bgClass} rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm w-full ${className}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {canClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className={`flex justify-end w-full`}
            aria-label={t("upgradeBanner.close", "Close")}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </motion.button>
        )}

        <div className={`hidden sm:block ${isRTL ? "pl-6" : "pr-6"}`}>
          <div className={`flex items-center justify-between mb-2`}>
            <div
              className={`flex items-center gap-2 md:gap-3 flex-1 min-w-0 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-1.5 bg-white/20 rounded-lg ${currentVariant.iconClass} flex-shrink-0`}
              >
                <IconComponent className="h-4 w-4" />
              </div>

              <div
                className={`flex-1 min-w-0 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-0.5 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <h3
                    className={`font-semibold text-sm ${currentVariant.textClass} truncate`}
                  >
                    {defaultTitle}
                  </h3>
                </div>
                <p className={`${currentVariant.textClass} opacity-80 text-xs`}>
                  {defaultDescription}
                </p>
              </div>
            </div>
          </div>

          {showProgressBar && (
            <div className="w-full max-w-md">
              <div
                className={`flex justify-between text-xs mb-1 ${
                  currentVariant.textClass
                } opacity-80 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span>
                  {t("upgradeBanner.currentUsage", "{{current}} used", {
                    current: currentUsage,
                  })}
                </span>
                <span>
                  {t("upgradeBanner.maxLimit", "{{max}} limit", {
                    max: maxLimit,
                  })}
                </span>
              </div>
              <div
                className={`w-full ${currentVariant.progressBg} rounded-full h-2 backdrop-blur-sm`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${actualPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`${currentVariant.progressFill} h-2 rounded-full shadow-sm`}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeBanner;
