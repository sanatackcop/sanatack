import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import {
  Play,
  RefreshCcw,
  Terminal,
  Copy,
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Plus,
  Lightbulb,
  Video,
  Sun,
} from "lucide-react";

interface ConsoleEntry {
  type: "error" | "warn" | "success" | "info" | "log";
  content: string;
}

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
}

const ICON_MAP: any = {
  error: "❌",
  warn: "⚠️",
  success: "✅",
  info: "ℹ️",
  log: "📝",
};

const COLOR_MAP: any = {
  error: "text-red-500",
  warn: "text-yellow-500",
  success: "text-green-500",
  info: "text-blue-500",
  log: "text-gray-300",
};

const INITIAL_CODE = `// تمرين رسم شجرة النجوم
function drawStarTree(rows) {
  for (let i = 1; i <= rows; i++) {
    const spaces = " ".repeat(rows - i);
    const stars = "*".repeat(2 * i - 1);
    console.log(spaces + stars);
  }
}

drawStarTree(5);`;

const INITIAL_FILES: FileNode[] = [
  {
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      { name: "index.js", type: "file", content: INITIAL_CODE },
      { name: "utils.js", type: "file", content: "// دوال مساعدة" },
      {
        name: "components",
        type: "folder",
        children: [
          { name: "App.js", type: "file", content: "// مكون التطبيق" },
        ],
      },
    ],
  },
  { name: "package.json", type: "file", content: '{ "name": "playground" }' },
  { name: "README.md", type: "file", content: "# ساحة البرمجة" },
];

export default function CodePlayground() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleEntry[]>([
    { type: "info", content: "وحدة التحكم جاهزة. شغّل الكود لترى النتيجة! 🚀" },
  ]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState(false);
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState("index.js");
  const [showFileExplorer, setShowFileExplorer] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data?.type === "codeChange") setCode(e.data.value);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  useEffect(() => {
    const theme = darkMode ? "vs-dark" : "vs";
    iframeRef.current?.contentWindow?.postMessage(
      { type: "updateCode", value: code },
      "*"
    );
    iframeRef.current?.contentWindow?.postMessage(
      { type: "theme", value: theme },
      "*"
    );
  }, [code, darkMode]);

  const runCode = useCallback(() => {
    try {
      setConsoleOutput([]);
      const logs: ConsoleEntry[] = [];
      const { log: oLog, error: oErr, warn: oWarn } = console;
      console.log = (...a) => logs.push({ type: "log", content: a.join(" ") });
      console.error = (...a) =>
        logs.push({ type: "error", content: a.join(" ") });
      console.warn = (...a) =>
        logs.push({ type: "warn", content: a.join(" ") });

      // eslint-disable-next-line no-new-func
      new Function(code)();

      console.log = oLog;
      console.error = oErr;
      console.warn = oWarn;

      setConsoleOutput(
        logs.length
          ? logs
          : [{ type: "success", content: "تم تنفيذ الكود بنجاح!" }]
      );
    } catch (e: any) {
      setConsoleOutput([{ type: "error", content: `خطأ: ${e.message}` }]);
    }
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(INITIAL_CODE);
    setConsoleOutput([
      {
        type: "info",
        content: "وحدة التحكم جاهزة. شغّل الكود لترى النتيجة! 🚀",
      },
    ]);
  }, []);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setConsoleOutput((prev) => [
      ...prev,
      { type: "success", content: "تم نسخ الكود!" },
    ]);
  }, [code]);

  const toggleFolder = (path: string[]) => {
    const newFiles = [...files];
    let current = newFiles;

    for (let i = 0; i < path.length - 1; i++) {
      const folder = current.find(
        (f) => f.name === path[i] && f.type === "folder"
      );
      if (folder?.children) {
        current = folder.children;
      }
    }

    const folder = current.find((f) => f.name === path[path.length - 1]);
    if (folder && folder.type === "folder") {
      folder.isOpen = !folder.isOpen;
    }

    setFiles(newFiles);
  };

  return (
    <div className={`flex h-dvh w-full font-sans`} dir="rtl">
      <aside className="w-[40%] flex flex-col border-l border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-slate-900 overflow-y-auto">
        <div className="border-b border-blue-200 dark:border-neutral-700 px-4 py-[14px] bg-blue-100 dark:bg-slate-800">
          <h2 className="font-semibold text-sm text-blue-900 dark:text-gray-100">
            التعليمات
          </h2>
        </div>

        <div className="overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Instruction card */}
            <div className="bg-blue-100 dark:bg-slate-800 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800 dark:text-gray-300 mb-3">
                انسخ والصق هذا السطر من الكود في السطر 3:
              </p>
              <div
                className="bg-white dark:bg-black rounded border border-blue-200 px-3 py-2 font-mono text-xs"
                dir="ltr"
              >
                <span className="text-pink-600 dark:text-pink-400">print</span>
                <span className="text-blue-700 dark:text-gray-300">(</span>
                <span className="text-green-600 dark:text-green-400">'Hi'</span>
                <span className="text-blue-700 dark:text-gray-300">)</span>
              </div>
            </div>

            <p className="text-sm text-blue-700 dark:text-gray-400">
              ثم اضغط على زر "تشغيل" وانتظر 1-2 ثانية.
            </p>

            <p className="text-sm text-blue-700 dark:text-gray-400">
              يجب أن يظهر هذا في نافذة الطرفية إذا فعلت ذلك بشكل صحيح:
            </p>

            <div className="bg-white dark:bg-black rounded border border-blue-200 px-3 py-2">
              <span className="text-blue-800 dark:text-gray-300 font-mono text-xs">
                Hi
              </span>
            </div>

            <p className="text-sm text-blue-700 dark:text-gray-400">
              أنت الآن جاهز للرحلة القادمة. (ノ◕ヮ◕)ノ*:･ﾟ✧
            </p>

            <p className="text-sm text-blue-700 dark:text-gray-400">
              اضغط على زر "تحقق من الإجابة" ثم "التالي" للمتابعة.
            </p>

            <p className="text-sm font-semibold text-blue-800 dark:text-gray-300">
              برمجة سعيدة!
            </p>
          </div>
        </div>
        <div className="border-t border-blue-200 dark:border-neutral-700">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full px-4 py-3 text-right hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors"
          >
            <h3 className="font-semibold text-sm text-blue-900 dark:text-gray-100">
              المساعدة
            </h3>
          </button>

          {showHelp && (
            <div className="px-4 pb-4 space-y-2">
              <button className="w-full justify-start gap-2 bg-blue-100 dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700 border border-blue-300 dark:border-slate-600 text-blue-800 dark:text-gray-200 px-3 py-2 rounded-md flex items-center text-sm">
                <Lightbulb className="h-4 w-4" />
                إظهار تلميح
              </button>
              <button className="w-full justify-start gap-2 bg-blue-100 dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700 border border-blue-300 dark:border-slate-600 text-blue-800 dark:text-gray-200 px-3 py-2 rounded-md flex items-center text-sm">
                <Video className="h-4 w-4" />
                مشاهدة فيديو
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-end border-b border-blue-200 dark:border-neutral-700 bg-blue-100 dark:bg-slate-800 px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-blue-700 dark:text-gray-400">
              {activeFile}
            </span>
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="p-1 hover:bg-blue-200 dark:hover:bg-slate-700 rounded"
              title={showFileExplorer ? "إخفاء المستكشف" : "إظهار المستكشف"}
            >
              <Folder className="h-4 w-4 text-blue-600 dark:text-gray-400" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden relative">
              <EditorFrame
                ref={iframeRef}
                initialCode={INITIAL_CODE}
                theme={darkMode ? "vs-dark" : "vs"}
              />

              <div className="absolute bottom-5 left-0 right-5 px-4 py-2 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={toggleMode}
                    className="gap-1 border border-blue-300 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded flex items-center text-sm"
                  >
                    <Sun className="h-4 w-4" />
                  </button>

                  <button
                    onClick={copyCode}
                    className="gap-1 border border-blue-300 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded flex items-center text-sm"
                  >
                    <Copy className="h-4 w-4" /> نسخ
                  </button>
                  <button
                    onClick={resetCode}
                    className="gap-1 border border-blue-300 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded flex items-center text-sm"
                  >
                    <RefreshCcw className="h-4 w-4" /> إعادة تعيين
                  </button>
                  <button
                    onClick={runCode}
                    className="gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
                  >
                    <Play className="h-4 w-4" /> تشغيل
                  </button>
                </div>
              </div>
            </div>

            <TerminalView entries={consoleOutput} />
          </div>

          {showFileExplorer && (
            <div className="w-64 border-l border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-slate-900 overflow-y-auto">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-700 dark:text-gray-400 uppercase">
                    المستكشف
                  </span>
                  <button className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-slate-800 rounded flex items-center justify-center">
                    <Plus className="h-3 w-3 text-blue-600 dark:text-gray-400" />
                  </button>
                </div>
                <FileTree
                  files={files}
                  onToggle={toggleFolder}
                  onSelect={setActiveFile}
                  activeFile={activeFile}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FileTree({
  files,
  onToggle,
  onSelect,
  activeFile,
  path = [],
}: {
  files: FileNode[];
  onToggle: (path: string[]) => void;
  onSelect: (filename: string) => void;
  activeFile: string;
  path?: string[];
}) {
  return (
    <div className="text-sm">
      {files.map((file) => {
        const currentPath = [...path, file.name];
        const isActive = file.name === activeFile;

        return (
          <div key={file.name}>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-slate-800 ${
                isActive ? "bg-blue-300 dark:bg-blue-900 bg-opacity-50" : ""
              }`}
              onClick={() => {
                if (file.type === "folder") {
                  onToggle(currentPath);
                } else {
                  onSelect(file.name);
                }
              }}
              style={{ paddingRight: `${path.length * 12 + 8}px` }}
            >
              {file.type === "folder" ? (
                <>
                  {file.isOpen ? (
                    <ChevronDown className="h-3 w-3 text-blue-500 dark:text-gray-500" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-blue-500 dark:text-gray-500" />
                  )}
                  <Folder className="h-4 w-4 text-blue-600 dark:text-yellow-600" />
                </>
              ) : (
                <>
                  <span className="w-3" />
                  <File className="h-4 w-4 text-blue-500 dark:text-gray-500" />
                </>
              )}
              <span
                className={`ml-1 ${
                  isActive
                    ? "text-blue-800 dark:text-blue-300"
                    : "text-blue-700 dark:text-gray-300"
                }`}
              >
                {file.name}
              </span>
            </div>
            {file.type === "folder" && file.isOpen && file.children && (
              <FileTree
                files={file.children}
                onToggle={onToggle}
                onSelect={onSelect}
                activeFile={activeFile}
                path={currentPath}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const EditorFrame = forwardRef<
  HTMLIFrameElement,
  { initialCode: string; theme: "vs-dark" | "vs" }
>(({ initialCode, theme }, ref) => {
  const bg = theme === "vs-dark" ? "#0f172a" : "#ffffff";

  return (
    <iframe
      ref={ref}
      title="monaco-editor"
      className="h-full w-full border-none"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={`<!DOCTYPE html><html><head><meta charset='utf-8'/><style>html,body,#container{height:100%;margin:0;background:${bg};}</style><script src='https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js'></script></head><body><div id='container'></div><script>require.config({paths:{vs:'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'}});require(['vs/editor/editor.main'],function(){const initialValue = ${JSON.stringify(
        initialCode
      )};const editor=monaco.editor.create(document.getElementById('container'),{value:initialValue,language:'javascript',theme:'${theme}',fontSize:14,fontFamily:'Fira Code,Consolas,monospace',automaticLayout:true,minimap:{enabled:false},mouseWheelZoom:true,padding:{bottom:60}});editor.onDidChangeModelContent(()=>{parent.postMessage({type:'codeChange',value:editor.getValue()},'*')});window.addEventListener('message',e=>{if(e.data&&e.data.type==='updateCode'&&typeof e.data.value==='string'&&e.data.value!==editor.getValue()){editor.setValue(e.data.value)};if(e.data&&e.data.type==='theme'&&typeof e.data.value==='string'){monaco.editor.setTheme(e.data.value);document.body.style.background=e.data.value==='vs-dark'?'#0f172a':'#ffffff';}});});</script></body></html>`}
    />
  );
});
EditorFrame.displayName = "EditorFrame";

export function TerminalView({ entries }: any) {
  return (
    <div className="h-72 rounded-none border-t border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-slate-900 shadow-none">
      <div className="flex h-10 items-end border-b border-blue-200 dark:border-neutral-700 px-4 py-0 bg-blue-100 dark:bg-slate-800">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-gray-300 pt-2">
          <Terminal className="h-4 w-4 text-blue-600 dark:text-gray-500" />
          console
        </div>
      </div>

      <div className="flex h-[calc(100%-2.5rem)] flex-col overflow-y-auto p-4 bg-white dark:bg-black">
        {entries.map((entry: any, i: number) => (
          <div
            key={i}
            className="mb-1 flex items-start gap-3 whitespace-pre-wrap break-words text-xs leading-relaxed"
          >
            <span className="pt-0.5 leading-none">{ICON_MAP[entry.type]}</span>
            <pre className={`${COLOR_MAP[entry.type]} font-mono`} dir="ltr">
              {entry.content}
            </pre>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-xs text-blue-600 dark:text-gray-500">
            <Terminal className="mx-auto h-5 w-5 opacity-50" />
            شغّل الكود لترى النتيجة...
          </div>
        )}
      </div>
    </div>
  );
}
