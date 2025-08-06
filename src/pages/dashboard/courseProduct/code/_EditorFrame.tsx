import { forwardRef } from "react";

interface EditorFrameProps {
  initialCode: string;
  theme: "vs-dark" | "vs";
}

const EditorFrame = forwardRef<HTMLIFrameElement, EditorFrameProps>(
  ({ initialCode, theme }, ref) => {
    const escapedCode = JSON.stringify(initialCode);

    const srcDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    html, body, #container {
      height: 100%;
      margin: 0;
      background: transparent; 
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js"></script>
</head>
<body>
  <div id="container"></div>

  <script>

    require.config({
      paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" }
    });

    require(["vs/editor/editor.main"], function () {

      const createTransparentTheme = (baseTheme) => {
        const transparentName = baseTheme + "-transparent";
        monaco.editor.defineTheme(transparentName, {
          base: baseTheme,
          inherit: true,
          rules: [],
          colors: { "editor.background": "#00000000" } // شفافية كاملة
        });
        return transparentName;
      };


      const initialTheme = "${theme}";
      const currentTransparentTheme = createTransparentTheme(initialTheme);
      monaco.editor.setTheme(currentTransparentTheme);


      const editor = monaco.editor.create(document.getElementById("container"), {
        value: ${escapedCode},
        language: "javascript",
        fontSize: 18,
        fontFamily: "Fira Code, Consolas, monospace",
        automaticLayout: true,
        minimap: { enabled: false },
        padding: { bottom: 80 }
        
      });


      editor.onDidChangeModelContent(() => {
        parent.postMessage(
          { type: "codeChange", value: editor.getValue() },
          "*"
        );
      });

      window.addEventListener("message", (e) => {
        const { type, value } = e.data || {};
        if (type === "updateCode" && typeof value === "string" && value !== editor.getValue()) {
          editor.setValue(value);
        }
        if (type === "theme" && (value === "vs" || value === "vs-dark")) {
          const newTransparent = createTransparentTheme(value);
          monaco.editor.setTheme(newTransparent);
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
        className="h-[400px] w-full border-none"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={srcDoc}
      />
    );
  }
);

EditorFrame.displayName = "EditorFrame";

export default EditorFrame;
