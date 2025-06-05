import { Link } from "react-router-dom";

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  to?: string;
  [key: string]: any;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  to,
  ...props
}) => {
  const baseClasses =
    "relative overflow-hidden font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl rounded-xl sm:rounded-2xl text-sm sm:text-base inline-block text-center";

  const variants = {
    primary:
      "bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 shadow-lg",
    secondary:
      "border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-900",
  };

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </Link>
    );
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};
