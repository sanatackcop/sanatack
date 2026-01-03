import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  ArrowLeft,
  Save,
  Loader2,
  Clock,
  FileText,
  Sparkles,
  Type,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { NoteEditorProps } from "./types";
import { motion } from "framer-motion";

// Custom color palette for text colors
const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#ffffff",
  "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ff0066", "#ff6600", "#99cc00", "#00cccc", "#3366ff", "#cc33ff",
  "#cc0000", "#cc6600", "#669900", "#006666", "#003399", "#660099",
];

// Custom color palette for highlights
const HIGHLIGHT_COLORS = [
  false, // No highlight
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff",
  "#ffeaa7", "#55efc4", "#81ecec", "#a29bfe", "#fd79a8", "#fab1a0",
  "#ffe6e6", "#e6ffe6", "#e6ffff", "#ffe6ff", "#fff0e6", "#e6e6ff",
  "#fdcb6e", "#00cec9", "#6c5ce7", "#e17055", "#74b9ff", "#f8a5c2",
];

const QUILL_MODULES = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: TEXT_COLORS }, { background: HIGHLIGHT_COLORS }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  },
  clipboard: {
    matchVisual: false,
  },
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
];

export default function NoteEditor({
  note,
  onSave,
  onClose,
  isNew = false,
}: NoteEditorProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";

  const [title, setTitle] = useState(
    note?.title || note?.payload?.title || ""
  );
  const [content, setContent] = useState(
    note?.content || note?.payload?.content || ""
  );
  const [saving, setSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || note.payload?.title || "");
      setContent(note.content || note.payload?.content || "");
    }
  }, [note]);

  // Set editor ready after a small delay to ensure Quill initializes
  useEffect(() => {
    const timer = setTimeout(() => setEditorReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }
    setSaving(true);
    try {
      await onSave(title, content);
    } finally {
      setSaving(false);
    }
  };

  // Get plain text from HTML content
  const getPlainText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const plainText = getPlainText(content);
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-gradient-to-b from-background via-background to-muted/20"
    >
      {/* Modern Header */}
      <div className="sticky top-0 z-20">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <div className="relative border-b border-border/50">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2.5 hover:bg-accent/80 rounded-xl transition-all duration-200 group"
                aria-label={t("common.back", "Go back")}
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </motion.button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full">
                {isNew ? (
                  <Sparkles className="h-4 w-4 text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm font-medium text-primary">
                  {isNew
                    ? t("note.editor.newNote", "New Note")
                    : t("note.editor.editNote", "Edit Note")}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Word count badge */}
              <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5" />
                  {wordCount} {t("note.editor.words", "words")}
                </span>
                <span className="w-px h-3 bg-border" />
                <span>{charCount} {t("note.editor.chars", "chars")}</span>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="gap-2 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">{t("common.saving", "Saving...")}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("common.save", "Save")}</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Title Input - Modern Textarea Style */}
          <div className="mb-6">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("note.editor.titlePlaceholder", "Untitled")}
              className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-0 resize-none outline-none placeholder:text-muted-foreground/40 focus:placeholder:text-muted-foreground/60 transition-colors leading-tight"
              dir={direction}
              rows={1}
              style={{ overflow: "hidden" }}
            />
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {note?.updated_at
                    ? new Date(note.updated_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : t("note.editor.justNow", "Just now")}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
          </div>

          {/* Quill Editor Container */}
          <motion.div
            className={`note-editor-modern rounded-2xl transition-all duration-300 ${
              isFocused
                ? "ring-2 ring-primary/20 shadow-xl shadow-primary/5"
                : "shadow-lg shadow-black/5"
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {editorReady ? (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder={t(
                  "note.editor.contentPlaceholder",
                  "Start writing your note..."
                )}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </motion.div>

          {/* Mobile word count */}
          <div className="md:hidden flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>{wordCount} {t("note.editor.words", "words")}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>{charCount} {t("note.editor.chars", "characters")}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style>{`
        .note-editor-modern {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.5);
          overflow: hidden;
        }
        
        .note-editor-modern .quill {
          display: flex;
          flex-direction: column;
        }
        
        .note-editor-modern .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
          background: linear-gradient(to bottom, hsl(var(--muted) / 0.5), hsl(var(--muted) / 0.3));
          padding: 12px 16px !important;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .note-editor-modern .ql-toolbar .ql-formats {
          margin-right: 8px !important;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .note-editor-modern .ql-toolbar button {
          width: 32px !important;
          height: 32px !important;
          border-radius: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
        }
        
        .note-editor-modern .ql-toolbar button:hover {
          background: hsl(var(--accent)) !important;
        }
        
        .note-editor-modern .ql-toolbar button.ql-active {
          background: hsl(var(--primary) / 0.15) !important;
          color: hsl(var(--primary)) !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker {
          height: 32px !important;
          border-radius: 8px !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker-label {
          border: none !important;
          padding: 4px 8px !important;
          border-radius: 8px !important;
          transition: all 0.15s ease !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker-label:hover {
          background: hsl(var(--accent)) !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker-options {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2) !important;
          padding: 8px !important;
          margin-top: 4px !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker-item {
          border-radius: 6px !important;
          padding: 4px 8px !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-picker-item:hover {
          background: hsl(var(--accent)) !important;
        }
        
        .note-editor-modern .ql-container {
          border: none !important;
          font-size: 16px;
          line-height: 1.8;
        }
        
        .note-editor-modern .ql-editor {
          min-height: 400px;
          padding: 24px !important;
          font-family: inherit;
        }
        
        .note-editor-modern .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground) / 0.5);
          font-style: normal;
          left: 24px !important;
          right: 24px !important;
        }
        
        .note-editor-modern .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 1em 0 0.5em;
          line-height: 1.3;
        }
        
        .note-editor-modern .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          line-height: 1.4;
        }
        
        .note-editor-modern .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          line-height: 1.4;
        }
        
        .note-editor-modern .ql-editor p {
          margin: 0.5em 0;
        }
        
        .note-editor-modern .ql-editor blockquote {
          border-left: 4px solid hsl(var(--primary) / 0.5);
          padding-left: 16px;
          margin: 16px 0;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          background: hsl(var(--muted) / 0.3);
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
        }
        
        .note-editor-modern .ql-editor pre {
          background: hsl(var(--muted));
          border-radius: 12px;
          padding: 16px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 14px;
          overflow-x: auto;
        }
        
        .note-editor-modern .ql-editor ul,
        .note-editor-modern .ql-editor ol {
          padding-left: 24px;
        }
        
        .note-editor-modern .ql-editor li {
          margin: 8px 0;
        }
        
        .note-editor-modern .ql-editor a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .note-editor-modern .ql-editor img {
          max-width: 100%;
          border-radius: 12px;
          margin: 16px 0;
        }
        
        /* Dark mode enhancements */
        .dark .note-editor-modern {
          background: hsl(var(--card));
        }
        
        .dark .note-editor-modern .ql-toolbar {
          background: linear-gradient(to bottom, hsl(var(--muted) / 0.3), hsl(var(--muted) / 0.1));
        }
        
        .dark .note-editor-modern .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
        }
        
        .dark .note-editor-modern .ql-fill {
          fill: hsl(var(--foreground)) !important;
        }
        
        .dark .note-editor-modern .ql-picker {
          color: hsl(var(--foreground)) !important;
        }
        
        .dark .note-editor-modern .ql-picker-options {
          background: hsl(var(--popover)) !important;
        }
        
        .dark .note-editor-modern .ql-editor {
          color: hsl(var(--foreground));
        }
        
        .dark .note-editor-modern .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        
        .dark .note-editor-modern .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
        
        /* Color Picker Styles */
        .note-editor-modern .ql-toolbar .ql-color-picker .ql-picker-options,
        .note-editor-modern .ql-toolbar .ql-background .ql-picker-options {
          width: 192px !important;
          padding: 8px !important;
          display: grid !important;
          grid-template-columns: repeat(6, 1fr) !important;
          gap: 4px !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-color-picker .ql-picker-item,
        .note-editor-modern .ql-toolbar .ql-background .ql-picker-item {
          width: 24px !important;
          height: 24px !important;
          border-radius: 4px !important;
          border: 1px solid hsl(var(--border) / 0.5) !important;
          padding: 0 !important;
          margin: 0 !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-color-picker .ql-picker-item:hover,
        .note-editor-modern .ql-toolbar .ql-background .ql-picker-item:hover {
          transform: scale(1.15) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }
        
        .note-editor-modern .ql-toolbar .ql-color-picker .ql-picker-item.ql-selected,
        .note-editor-modern .ql-toolbar .ql-background .ql-picker-item.ql-selected {
          border: 2px solid hsl(var(--primary)) !important;
        }
        
        .dark .note-editor-modern .ql-toolbar .ql-color-picker .ql-picker-options,
        .dark .note-editor-modern .ql-toolbar .ql-background .ql-picker-options {
          background: hsl(var(--popover)) !important;
          border-color: hsl(var(--border)) !important;
        }
        
        /* RTL Support */
        ${isRTL ? `
        .note-editor-modern .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .note-editor-modern .ql-editor.ql-blank::before {
          left: auto !important;
          right: 24px !important;
        }
        .note-editor-modern .ql-editor blockquote {
          border-left: none;
          border-right: 4px solid hsl(var(--primary) / 0.5);
          padding-left: 16px;
          padding-right: 16px;
          border-radius: 8px 0 0 8px;
        }
        ` : ""}
        
        /* Scrollbar styling */
        .note-editor-modern .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        
        .note-editor-modern .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .note-editor-modern .ql-editor::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 4px;
        }
        
        .note-editor-modern .ql-editor::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .note-editor-modern .ql-toolbar {
            padding: 8px 12px !important;
          }
          
          .note-editor-modern .ql-toolbar button {
            width: 28px !important;
            height: 28px !important;
          }
          
          .note-editor-modern .ql-editor {
            padding: 16px !important;
            min-height: 300px;
          }
          
          .note-editor-modern .ql-editor.ql-blank::before {
            left: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
