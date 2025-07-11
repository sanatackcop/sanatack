export interface ConsoleEntry {
  type: "error" | "warn" | "success" | "info" | "log";
  content: string;
}

export const ICON_MAP: any = {
  error: "❌",
  warn: "⚠️",
  success: "✅",
  info: "ℹ️",
  log: "📝",
};

export const COLOR_MAP: any = {
  error: "text-red-600",
  warn: "text-yellow-600",
  success: "text-green-600",
  info: "text-blue-600",
  log: "text-gray-700 dark:text-gray-300",
};
