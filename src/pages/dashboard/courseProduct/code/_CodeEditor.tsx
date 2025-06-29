import { LoaderCircleIcon, PlayIcon, RefreshCcw, FileCode } from "lucide-react";
import EditorFrame from "./_EditorFrame";
import TerminalView from "./_TerminalView";
import { ConsoleEntry } from "./type";

export default function CodeEditor({
  darkMode,
  isRunning,
  currentLang,
  runCode,
  resetCode,
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

  const bgCanvas = "bg-[#0b0e14]";
  const bgPanel = "bg-[#1a1f2b]";
  const bgSubtle = "bg-[#0d1117]";
  const borderClr = "border-gray-800";
  const textMuted = "text-gray-400";

  return (
    <main
      className={`flex-1 flex flex-col overflow-hidden ${bgCanvas} text-gray-200`}
    >
      <header
        className={`flex items-center justify-end px-4 py-2 ${bgPanel} border-b ${borderClr}`}
      >
        <div className="flex items-center">
          <div
            className={`flex items-center gap-2 ${bgSubtle} border ${borderClr} rounded-t-lg px-3 py-2 font-mono text-sm shadow-sm`}
          >
            <FileCode className="w-4 h-4 text-blue-500" />
            <span>{`index.${langMap[currentLang] || currentLang}`}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-hidden relative">
          <EditorFrame
            ref={iframeRef}
            initialCode={initialCode}
            theme={darkMode ? "vs-dark" : "vs"}
          />

          <div className="absolute bottom-6 right-6 flex gap-3">
            <button
              onClick={resetCode}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${textMuted} ${bgSubtle} border ${borderClr} rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg`}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-500 border border-green-700 disabled:border-green-500 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
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
