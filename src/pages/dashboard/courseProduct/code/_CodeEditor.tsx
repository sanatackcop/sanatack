import {
  LoaderCircleIcon,
  PlayIcon,
  RefreshCcw,
  FileCode,
  CodeIcon,
} from "lucide-react";
import EditorFrame from "./_EditorFrame";
import TerminalView from "./_TerminalView";
import { ConsoleEntry } from "./type";

export default function CodeEditor({
  darkMode,
  isRunning,
  currentLang,
  runCode,
  resetCode,
  checkCode,
  iframeRef,
  consoleOutput,
  initialCode,
}: {
  code: string;
  darkMode: boolean;
  isRunning: boolean;
  currentLang: string;
  runCode: () => void;
  resetCode: () => void;
  checkCode: () => void;
  copyCode: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  consoleOutput: ConsoleEntry[];
  initialCode: string;
}) {
  const langMap: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    html: "html",
    css: "css",
  };

  const bgCanvas = "bg-[#f3f4f6] dark:bg-[#0d1117]";
  const bgSubtle = " bg-[#f3f4f6] dark:bg-[#0d1117]";
  const borderClr = "border-gray-300 dark:border-gray-700";
  const textMuted = "text-gray-900 dark:text-gray-400";

  return (
    <main
      className={`h-1/2 md:h-full w-full md:w-[60%] overflow-auto scrollbar-hidden ${bgCanvas} text-gray-900 dark:text-gray-200`}
    >
      <header
        className="sticky top-0 left-0 right-0 z-30 border-r
             bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-8 py-6"
        dir="ltr"
      >
        <div className="mx-auto flex  items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">
              <span>{`index.${langMap[currentLang] || currentLang}`}</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden scrollbar-hidden  relative">
        <div className="flex-1 overflow-hidden relative p-4">
          <EditorFrame
            ref={iframeRef}
            initialCode={initialCode}
            theme={darkMode ? "vs-dark" : "vs"}
          />

          <div className="absolute bottom-6 right-10 flex gap-3">
            <button
              onClick={resetCode}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${textMuted} ${bgSubtle} border ${borderClr} rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg`}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={checkCode}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 border border-blue-700 disabled:border-blue-500 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
            >
              {isRunning ? (
                <LoaderCircleIcon className="w-4 h-4 animate-spin" />
              ) : (
                <FileCode className="w-4 h-4" />
              )}
              {isRunning ? "Checking…" : "Check"}
            </button>

            <button
              onClick={runCode}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white bg-green-600 hover:bg-green-700 disabled:bg-green-500 border border-green-700 disabled:border-green-500 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
            >
              {isRunning ? (
                <LoaderCircleIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
              {isRunning ? "Running…" : "Run"}
            </button>
          </div>
        </div>

        <TerminalView entries={consoleOutput} />
      </div>
    </main>
  );
}
