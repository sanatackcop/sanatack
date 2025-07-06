export interface ConsoleEntry {
  type: "error" | "warn" | "success" | "info" | "log";
  content: string;
}

export interface CodeSnippet {
  lang: string;
  code: string;
}

export interface Section {
  type: string;
  title: string;
  description: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  codeSnippet?: CodeSnippet;
  order: number;
}

export interface Material {
  id: string;
  created_at: string;
  updated_at: string;
  main_title: string;
  duration: number;
  data: Section[];
  hint: string;
  initialCode: string;
  order: number;
  type: string;
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
