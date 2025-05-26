import { useState, useEffect, useRef } from "react";
import {
  Play,
  Copy,
  Download,
  RotateCcw,
  Code,
  Eye,
  BookOpen,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";

const CodeEditorPlayground = () => {
  const { darkMode } = useSettings();
  const [code, setCode] = useState(`// مرحباً بك في محرر الأكواد العربي!
// جرب تعديل هذا الكود

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

console.log("متتابعة فيبوناتشي:");
for (let i = 0; i < 8; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

console.log("الأرقام المضاعفة:", doubled);

// جرب تغيير الكود وشاهد النتيجة!`);

  const [output, setOutput] = useState("");
  const [highlightedCode, setHighlightedCode] = useState("");
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // TODO: fix me
  const highlightSyntax = (code: any) => {
    return (
      code
        // Comments
        .replace(/(\/\/.*$)/gm, '<span class="text-green-400 italic">$1</span>')
        // Strings
        .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
        .replace(/('.*?')/g, '<span class="text-yellow-300">$1</span>')
        .replace(/(`.*?`)/g, '<span class="text-yellow-300">$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="text-blue-300">$1</span>')
        // Keywords
        .replace(
          /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|async|await|try|catch|finally|throw|new|this|super|static|get|set|typeof|instanceof)\b/g,
          '<span class="text-purple-400 font-semibold">$1</span>'
        )
        // Built-in objects and methods
        .replace(
          /\b(console|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|setTimeout|setInterval|document|window)\b/g,
          '<span class="text-cyan-400">$1</span>'
        )
        // Functions calls
        .replace(/(\w+)(\()/g, '<span class="text-blue-400">$1</span>$2')
        // Operators
        .replace(
          /(\+|\-|\*|\/|%|===|==|!==|!=|<=|>=|<|>|&&|\|\||!)/g,
          '<span class="text-red-400">$1</span>'
        )
        // Brackets and parentheses
        .replace(/([(){}[\]])/g, '<span class="text-gray-300">$1</span>')
    );
  };

  useEffect(() => {
    setHighlightedCode(highlightSyntax(code));
  }, [code, darkMode]);

  const runCode = () => {
    try {
      const logs: any = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
        originalLog(...args);
      };

      const result = eval(code);

      console.log = originalLog;

      let output = logs.join("\n");
      if (result !== undefined) {
        output += (output ? "\n" : "") + `النتيجة: ${result}`;
      }

      setOutput(output || "تم تنفيذ الكود بنجاح!");
    } catch (error: any) {
      setOutput(`خطأ: ${error.message}`);
    }
  };

  const clearCode = () => {
    setOutput("");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("فشل في نسخ الكود:", err);
    }
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "code.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleScroll = (e: any) => {
    if (highlightRef.current) {
      // highlightRef.current.scrollTop = e.target.scrollTop;
      // highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const themeClasses = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const cardClasses = darkMode
    ? "bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl"
    : "bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl";

  const buttonClasses = darkMode
    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg";

  const editorBg = darkMode ? "bg-gray-900/90" : "bg-gray-50/90";

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${themeClasses}`}
      dir="rtl"
    >
      {/* Header */}
      <header
        className={`border-b backdrop-blur-md ${
          darkMode
            ? "border-gray-700/50 bg-gray-900/30"
            : "border-gray-200/50 bg-white/30"
        } p-4`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              } text-white shadow-lg`}
            >
              <Code size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                محرر الأكواد
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                بيئة البرمجة التفاعلية
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div
              className={`px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-800/50" : "bg-gray-100/50"
              } backdrop-blur-sm`}
            >
              <span className="text-sm font-medium">JavaScript</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-160px)]">
          {/* Code Editor Panel */}
          <div
            className={`rounded-2xl border ${cardClasses} flex flex-col overflow-hidden`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                darkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <h2 className="font-bold text-lg flex items-center space-x-2 space-x-reverse">
                  <Code size={20} />
                  <span>محرر الكود</span>
                </h2>
                <div className="flex space-x-1 space-x-reverse">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"
                  } backdrop-blur-sm`}
                  title="نسخ الكود"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={downloadCode}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"
                  } backdrop-blur-sm`}
                  title="تحميل الكود"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={clearCode}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"
                  } backdrop-blur-sm`}
                  title="مسح الكود"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              {/* Syntax highlighted background */}
              <div
                ref={highlightRef}
                className={`absolute inset-0 p-4 font-mono text-sm leading-6 overflow-auto pointer-events-none ${editorBg} text-transparent`}
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />

              {/* Textarea overlay */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                className={`absolute inset-0 w-full h-full resize-none font-mono text-sm leading-6 focus:outline-none bg-transparent text-transparent caret-white p-4`}
                placeholder="ابدأ البرمجة هنا..."
                spellCheck="false"
                dir="ltr"
                style={{ caretColor: darkMode ? "white" : "black" }}
              />
            </div>

            <div
              className={`p-4 border-t ${
                darkMode ? "border-gray-700/50" : "border-gray-200/50"
              } bg-gradient-to-r ${
                darkMode
                  ? "from-gray-800/50 to-gray-900/50"
                  : "from-gray-50/50 to-white/50"
              }`}
            >
              <button
                onClick={runCode}
                className={`${buttonClasses} px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-3 space-x-reverse transform hover:scale-105`}
              >
                <Play size={18} />
                <span>تشغيل الكود</span>
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div
            className={`rounded-2xl border ${cardClasses} flex flex-col overflow-hidden`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                darkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <h2 className="font-bold text-lg flex items-center space-x-2 space-x-reverse">
                <Eye size={20} />
                <span>النتائج والوحة التحكم</span>
              </h2>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    output.includes("خطأ")
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : output
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : darkMode
                      ? "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                      : "bg-gray-100/50 text-gray-600 border border-gray-300/30"
                  }`}
                >
                  {output.includes("خطأ") ? "خطأ" : output ? "نجح" : "جاهز"}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div
                className={`h-full rounded-xl p-4 font-mono text-sm overflow-auto ${editorBg} backdrop-blur-sm border ${
                  darkMode ? "border-gray-700/30" : "border-gray-200/30"
                }`}
              >
                {output ? (
                  <pre className="whitespace-pre-wrap" dir="ltr">
                    {output}
                  </pre>
                ) : (
                  <div
                    className={`${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    } italic text-center mt-8`}
                  >
                    اضغط على "تشغيل الكود" لرؤية النتائج هنا...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Tips Section */}
        <div
          className={`mt-8 rounded-2xl border ${cardClasses} p-6 overflow-hidden`}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3 space-x-reverse">
            <BookOpen size={24} className="text-blue-400" />
            <span>نصائح التعلم</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30"
                  : "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50"
              } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <div className="text-2xl mb-3">🚀</div>
              <h4 className="font-bold mb-3 text-blue-400">ابدأ بالأساسيات</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                ابدأ بالمفاهيم البسيطة وتدرج نحو المعقد تدريجياً
              </p>
            </div>
            <div
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30"
                  : "bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50"
              } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <div className="text-2xl mb-3">💡</div>
              <h4 className="font-bold mb-3 text-purple-400">جرب وأكتشف</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                لا تخف من تعديل الكود ومشاهدة ما يحدث!
              </p>
            </div>
            <div
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30"
                  : "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50"
              } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <div className="text-2xl mb-3">🔍</div>
              <h4 className="font-bold mb-3 text-green-400">تصحيح الأخطاء</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                استخدم console.log() لفهم ما يفعله الكود
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPlayground;
