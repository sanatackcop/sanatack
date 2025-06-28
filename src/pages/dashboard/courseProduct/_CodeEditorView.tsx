import { useSettings } from "@/context/SettingsContexts";
import { useState, useRef, useEffect, useCallback } from "react";
import CodeEditor from "./code/_CodeEditor";
import { ConsoleEntry } from "./code/type";
import InstructionsPanel from "./code/_InstructionsPanel";

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

      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: currentSection?.codeSnippet?.lang || "javascript",
          materialId: material.id,
          sectionId: currentSection?.order,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setConsoleOutput(
          result.output || [
            { type: "success", content: "Code executed successfully!" },
          ]
        );
      } else {
        setConsoleOutput([
          { type: "error", content: result.error || "Execution failed" },
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
    <div className={`flex h-screen w-full font-sans ${darkMode ? "dark" : ""}`}>
      <InstructionsPanel
        material={material}
        currentSectionIndex={currentSectionIndex}
        setCurrentSectionIndex={setCurrentSectionIndex}
      />

      <CodeEditor
        code={code}
        darkMode={darkMode}
        isRunning={isRunning}
        currentLang={currentSection?.codeSnippet?.lang || "js"}
        runCode={runCode}
        resetCode={resetCode}
        copyCode={copyCode}
        iframeRef={iframeRef}
        consoleOutput={consoleOutput}
        initialCode={material.initialCode}
      />
    </div>
  );
}
