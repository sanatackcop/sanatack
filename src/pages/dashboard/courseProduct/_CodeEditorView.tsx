import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useState } from "react";
import {
  Terminal,
  Lightbulb,
  Target,
} from "lucide-react";

export function CodeEditorView() {
  const [code, setCode] = useState<string>(`const hello = "Hello"`);

  const [consoleOutput, setConsoleOutput] = useState<
    { type: "log" | "error" | "warn" | "success" | "info"; content: string }[]
  >([
    {
      type: "info",
      content: "وحدة التحكم جاهزة. شغل الكود لرؤية النتائج هنا! 🚀",
    },
  ]);

  const iconMap = {
    error: "❌",
    warn: "⚠️",
    success: "✅",
    info: "ℹ️",
    log: "📝",
  } as Record<string, string>;

  const colorMap = {
    error: "text-red-600 dark:text-red-400",
    warn: "text-yellow-600 dark:text-yellow-400",
    success: "text-green-600 dark:text-green-400",
    info: "text-blue-600 dark:text-blue-400",
    log: "text-gray-700 dark:text-gray-300",
  } as Record<string, string>;

  const getConsoleIcon = (t: string) => iconMap[t] ?? "📝";
  const getConsoleColor = (t: string) =>
    colorMap[t] ?? "text-gray-700 dark:text-gray-300";

  const runCode = () => {
    try {
      setConsoleOutput([]);
      const logs: typeof consoleOutput = [];

      const { log: origLog, error: origError, warn: origWarn } = console;
      console.log = (...a: any[]) =>
        logs.push({ type: "log", content: a.join(" ") });
      console.error = (...a: any[]) =>
        logs.push({ type: "error", content: a.join(" ") });
      console.warn = (...a: any[]) =>
        logs.push({ type: "warn", content: a.join(" ") });

      new Function(code)();

      console.log = origLog;
      console.error = origError;
      console.warn = origWarn;

      setConsoleOutput(
        logs.length
          ? logs
          : [{ type: "success", content: "تم تنفيذ الكود بنجاح!" }]
      );
    } catch (e: any) {
      setConsoleOutput([{ type: "error", content: `خطأ: ${e.message}` }]);
    }
  };

  const resetCode = () => {
    setCode(`// مثال على TypeScript
interface User {
  name: string;
  age: number;
}

const user: User = { name: "أحمد", age: 25 };
console.log("اسمي " + user.name + " وعمري " + user.age + " سنة");
`);
    setConsoleOutput([
      {
        type: "info",
        content: "وحدة التحكم جاهزة. شغل الكود لرؤية النتائج هنا! 🚀",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden flex-row-reverse space-x-reverse space-x-6">
        <aside className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                📘 تعليمات التمرين
              </h2>
              <div
                className="prose prose-sm dark:prose-invert text-right"
                dir="rtl"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  اكتب دالة TypeScript تقوم بطباعة شجرة من النجوم باستخدام
                  الحلقات.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  الهدف هو إنشاء شكل هرمي من النجوم يبدأ بنجمة واحدة في الأعلى
                  ويزيد تدريجيًا.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                المطلوب تحقيقه:
              </h3>
              <ul
                className="text-xs text-blue-800 dark:text-blue-200 space-y-1"
                dir="rtl"
              >
                <li>• استخدام for loops لإنشاء النمط</li>
                <li>• طباعة المسافات والنجوم بشكل صحيح</li>
                <li>• إنشاء شكل هرمي متماثل</li>
                <li>• استخدام console.log لعرض النتيجة</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h3 className="text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                💡 نصائح مفيدة:
              </h3>
              <ul
                className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1"
                dir="rtl"
              >
                <li>• ابدأ بحلقة خارجية للصفوف</li>
                <li>• استخدم حلقتين داخليتين للمسافات والنجوم</li>
                <li>• فكر في العلاقة الرياضية بين رقم الصف وعدد النجوم</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CodeMirror
              className="text-left text-base"
              style={{ direction: "ltr" }}
              value={code}
              height="100%"
              extensions={[javascript({ typescript: true })]}
              theme={oneDark}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                foldGutter: true,
              }}
              onChange={(v) => setCode(v)}
            />
          </div>

          <div className="h-48 bg-gray-800 border-t border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">
                  وحدة التحكم
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={runCode}
                  className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  تشغيل
                </button>
                <button
                  onClick={resetCode}
                  className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-gray-900 hover:bg-yellow-600 transition-colors"
                >
                  إعادة تعيين
                </button>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  مسح
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {consoleOutput.map((o, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-lg leading-none">
                    {getConsoleIcon(o.type)}
                  </span>
                  <span
                    className={`flex-1 font-mono ${getConsoleColor(o.type)}`}
                  >
                    {o.content}
                  </span>
                </div>
              ))}

              {consoleOutput.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-8">
                  شغل الكود لرؤية النتائج هنا...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
