import { forwardRef } from "react";

interface EditorFrameProps {
  initialCode: string;
  theme: "vs-dark" | "vs";
}

const EditorFrame = forwardRef<HTMLIFrameElement, EditorFrameProps>(
  ({ initialCode, theme }, ref) => {
    const bg = theme === "vs-dark" ? "#111827" : "#f9fafb";

    const escapedCode = JSON.stringify(initialCode); // safely stringify user code

    const srcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body, #container {
      height: 100%;
      margin: 0;
      background: ${bg};
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs"
      }
    });

    require(["vs/editor/editor.main"], function () {
      const initialValue = ${escapedCode};

      const editor = monaco.editor.create(document.getElementById("container"), {
        value: initialValue,
        language: "javascript",
        theme: "${theme}",
        fontSize: 14,
        fontFamily: "Fira Code, Consolas, monospace",
        automaticLayout: true,
        minimap: { enabled: false },
        padding: { bottom: 80 }
      });

      editor.onDidChangeModelContent(() => {
        parent.postMessage({
          type: "codeChange",
          value: editor.getValue()
        }, "*");
      });

      window.addEventListener("message", (e) => {
        if (e.data?.type === "updateCode" && typeof e.data.value === "string" && e.data.value !== editor.getValue()) {
          editor.setValue(e.data.value);
        }
        if (e.data?.type === "theme" && typeof e.data.value === "string") {
          monaco.editor.setTheme(e.data.value);
          document.body.style.background = e.data.value === "vs-dark" ? "#111827" : "#f9fafb";
        }
      });
    });
  </script>
</body>
</html>
    `.trim();

    return (
      <iframe
        ref={ref}
        title="monaco-editor"
        className="h-full w-full border-none"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={srcDoc}
      />
    );
  }
);

EditorFrame.displayName = "EditorFrame";

export default EditorFrame;
