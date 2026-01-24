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
import { useSettings } from "@/context/SettingsContexts";

/* ---------- Color Palettes ---------- */

const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#ffffff",
  "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ff0066", "#ff6600", "#99cc00", "#00cccc", "#3366ff", "#cc33ff",
  "#cc0000", "#cc6600", "#669900", "#006666", "#003399", "#660099",
];

const HIGHLIGHT_COLORS = [
  false,
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff",
  "#ffeaa7", "#55efc4", "#81ecec", "#a29bfe", "#fd79a8", "#fab1a0",
  "#ffe6e6", "#e6ffe6", "#e6ffff", "#ffe6ff", "#fff0e6", "#e6e6ff",
  "#fdcb6e", "#00cec9", "#6c5ce7", "#e17055", "#74b9ff", "#f8a5c2",
];

/* ---------- Quill Config ---------- */

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
  clipboard: { matchVisual: false },
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

/* ---------- Component ---------- */

export default function NoteEditor({
  note,
  onSave,
  onClose,
  isNew = false,
}: NoteEditorProps) {
  const { t, i18n } = useTranslation();
  const { darkMode } = useSettings();

  const direction = i18n.dir();
  const isRTL = direction === "rtl";

  const [title, setTitle] = useState(note?.title || note?.payload?.title || "");
  const [content, setContent] = useState(
    note?.content || note?.payload?.content || ""
  );
  const [saving, setSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const quillRef = useRef<ReactQuill>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- Effects ---------- */

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

  useEffect(() => {
    const timer = setTimeout(() => setEditorReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- Helpers ---------- */

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(title, content);
    } finally {
      setSaving(false);
    }
  };

  const getPlainText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || "";
  };

  const plainText = getPlainText(content);
  const wordCount = plainText.trim()
    ? plainText.trim().split(/\s+/).length
    : 0;
  const charCount = plainText.length;

  /* ---------- Render ---------- */

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        flex flex-col h-full
        bg-gradient-to-b from-background via-background to-muted/20
        ${darkMode ? "dark" : ""}
      `}
    >
      {/* ---------- Header ---------- */}
      <div className="sticky top-0 z-20">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <div className="relative border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-accent transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
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

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5" />
                  {wordCount} {t("note.editor.words", "words")}
                </span>
                <span className="w-px h-3 bg-border" />
                <span>{charCount} {t("note.editor.chars", "chars")}</span>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="gap-2 rounded-xl"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {t("common.save", "Save")}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("note.editor.titlePlaceholder", "Untitled")}
            className="w-full text-4xl font-bold bg-transparent border-0 resize-none outline-none"
            rows={1}
          />

          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {note?.updated_at
              ? new Date(note.updated_at).toLocaleString()
              : t("note.editor.justNow", "Just now")}
          </div>

          <div className="my-6 border-t border-border/50" />

          {/* Editor */}
          <motion.div
            className={`note-editor-modern rounded-2xl ${
              isFocused
                ? "ring-2 ring-primary/20 shadow-xl"
                : "shadow-lg"
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
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ---------- Styles ---------- */}
      <style>{`
        .note-editor-modern {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          overflow: hidden;
        }

        .ql-toolbar {
          border: none !important;
          background: hsl(var(--muted));
        }

        .ql-container {
          border: none !important;
          background: hsl(var(--card));
        }

        .ql-editor {
          min-height: 400px;
          padding: 24px;
          color: hsl(var(--foreground));
        }

        .dark .ql-tooltip,
        .dark .ql-toolbar,
        .dark .ql-container {
          background: hsl(var(--popover)) !important;
          color: hsl(var(--foreground)) !important;
        }

        .dark .ql-tooltip input {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
        }

        ${isRTL ? `
          .ql-editor {
            direction: rtl;
            text-align: right;
          }
        ` : ""}
      `}</style>
    </motion.div>
  );
}
