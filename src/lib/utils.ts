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

export function checkIsNewCourse(creation_time: string) {
  const createdDate = new Date(creation_time);
  const now = new Date();
  return (
    createdDate.getFullYear() === now.getFullYear() &&
    createdDate.getMonth() === now.getMonth()
  );
}
