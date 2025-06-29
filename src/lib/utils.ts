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
