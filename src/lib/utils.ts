import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DateDisplay(date: string) {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(
  dateString: string | number | Date,
  lang: "ar" | "en" = "en"
): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (diffInSeconds < 60) return lang === "en" ? "just now" : "الآن";

  if (diffInSeconds < 3600) {
    if (lang === "en")
      return `${minutes} ${minutes === 1 ? "minute ago" : "minutes ago"}`;
    else
      return minutes === 1
        ? "منذ دقيقة"
        : minutes === 2
        ? "منذ دقيقتين"
        : minutes < 11
        ? `منذ ${minutes} دقائق`
        : `منذ ${minutes} دقيقة`;
  }

  if (diffInSeconds < 86400) {
    if (lang === "en")
      return `${hours} ${hours === 1 ? "hour ago" : "hours ago"}`;
    else
      return hours === 1
        ? "منذ ساعة"
        : hours === 2
        ? "منذ ساعتين"
        : hours < 11
        ? `منذ ${hours} ساعات`
        : `منذ ${hours} ساعة`;
  }

  if (diffInSeconds < 30 * 86400) {
    if (lang === "en") return `${days} ${days === 1 ? "day ago" : "days ago"}`;
    else
      return days === 1
        ? "منذ يوم"
        : days === 2
        ? "منذ يومين"
        : days < 11
        ? `منذ ${days} أيام`
        : `منذ ${days} يوم`;
  }

  return date.toLocaleDateString(lang === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
