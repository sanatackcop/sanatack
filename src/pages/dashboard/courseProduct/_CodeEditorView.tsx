import { useSettings } from "@/context/SettingsContexts";
import { useState, useRef, useEffect, useCallback } from "react";
import CodeEditor from "./code/_CodeEditor";
import { ConsoleEntry } from "./code/type";
import InstructionsPanel from "./code/_InstructionsPanel";
import { codeCheckApi, codeExecutionApi } from "@/utils/_apis/courses-apis";

export default function CodePlayground({ material }: { material: any }) {
  const [code, setCode] = useState(
    material.initialCode || "// Start coding here..."
  );
  const { darkMode } = useSettings();
  const [consoleOutput, setConsoleOutput] = useState<ConsoleEntry[]>([
    {
      type: "info",
      content: "Console ready. Run your code to see the output! 🚀",
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentSection = material.data[currentSectionIndex];

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

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data?.type === "codeChange") setCode(e.data.value);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  const runCode = useCallback(async () => {
    try {
      setIsRunning(true);
      setConsoleOutput([{ type: "info", content: "Running code..." }]);

      const result = await codeExecutionApi({
        code,
        language: currentSection?.codeSnippet?.lang || "javascript",
        stdin: "",
      });

      if (result.success) {
        setConsoleOutput([
          {
            type: "success",
            content: result.output || "Code executed successfully!",
          },
        ]);
      } else {
        setConsoleOutput([
          {
            type: "error",
            content: result.error || "Execution failed",
          },
        ]);
      }
    } catch (error: any) {
      setConsoleOutput([
        {
          type: "error",
          content: `Error: ${error.message || "Failed to execute code"}`,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [code, currentSection, material.id]);

  const checkCode = useCallback(async () => {
    try {
      setIsRunning(true);
      setConsoleOutput([
        { type: "info", content: "Checking code against test cases..." },
      ]);

      const result = await codeCheckApi({
        code,
        language: currentSection?.codeSnippet?.lang || "javascript",
        lessonId: material.id,
      });

      const summary = `Passed ${result.passed} out of ${result.total} test cases.`;
      const detailed = result.results.map((r, i) => {
        return {
          type: r.success ? "success" : "error",
          content: `Test ${i + 1}:\n  Input: ${r.input}\n  Expected: ${r.expectedOutput}\n  Actual: ${r.actualOutput}${r.error ? `\n  Error: ${r.error}` : ""}`,
        } as ConsoleEntry;
      });

      setConsoleOutput([{ type: "info", content: summary }, ...detailed]);
    } catch (error: any) {
      setConsoleOutput([
        {
          type: "error",
          content: `Error: ${error.message || "Failed to check code"}`,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [code, currentSection, material.id]);

  const resetCode = useCallback(() => {
    setCode(material.initialCode || "// Start coding here...");
    setConsoleOutput([
      {
        type: "info",
        content: "Console ready. Run your code to see the output! 🚀",
      },
    ]);
  }, [material.initialCode]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setConsoleOutput((prev) => [
      ...prev,
      { type: "success", content: "Code copied to clipboard!" },
    ]);
  }, [code]);

  return (
    <div
      className={`flex flex-col md:flex-row h-screen w-full font-sans ${
        darkMode ? "dark" : ""
      }`}
    >
      <InstructionsPanel
        material={material}
        currentContainerIndex={currentSectionIndex}
        setCurrentContainerIndex={setCurrentSectionIndex}
      />

      <CodeEditor
        code={code}
        darkMode={darkMode}
        isRunning={isRunning}
        currentLang={currentSection?.codeSnippet?.lang || "js"}
        runCode={runCode}
        checkCode={checkCode}
        resetCode={resetCode}
        copyCode={copyCode}
        iframeRef={iframeRef}
        consoleOutput={consoleOutput}
        initialCode={material.initialCode}
      />
    </div>
  );
}
