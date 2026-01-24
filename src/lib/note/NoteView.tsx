import { ArrowLeft, Edit, Calendar, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NoteViewProps } from "./types";
import { useState } from "react";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";

export function NoteView({ note, onClose, onSave, onDelete }: NoteViewProps) {
  const { t, i18n } = useTranslation();
  const direction = note.language == "ar" ? "rtl" : i18n.dir();
  const [isDeleting, setIsDeleting] = useState(false);

  const title = note.title || note.payload?.title || t("note.untitled", "Untitled Note");
  const content = note.content || note.payload?.content || "";

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!window.confirm(t("note.confirmDelete", "Are you sure you want to delete this note?"))) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(note.id);
      toast.success(t("note.deleted", "Note deleted successfully"));
      onClose();
    } catch (err) {
      console.error("Failed to delete note:", err);
      toast.error(t("note.deleteFailed", "Failed to delete note"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div dir={direction} className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="shrink-0 p-2 hover:bg-accent dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label={t("common.back", "Go back")}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate text-foreground">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(note)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t("common.edit", "Edit")}
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t("common.delete", "Delete")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          {content ? (
            <div 
              className="ql-editor prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {t("note.emptyContent", "This note is empty")}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Styles for rendered content */}
      <style>{`
        .ql-editor {
          padding: 0;
          color: hsl(var(--foreground));
        }
        .ql-editor h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; color: hsl(var(--foreground)); }
        .ql-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; color: hsl(var(--foreground)); }
        .ql-editor h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; color: hsl(var(--foreground)); }
        .ql-editor h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; color: hsl(var(--foreground)); }
        .ql-editor h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; color: hsl(var(--foreground)); }
        .ql-editor h6 { font-size: 0.67em; font-weight: bold; margin: 1.67em 0; color: hsl(var(--foreground)); }
        .ql-editor p { margin: 1em 0; color: hsl(var(--foreground)); }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5em; margin: 1em 0; color: hsl(var(--foreground)); }
        .ql-editor li { margin: 0.5em 0; }
        .ql-editor blockquote {
          border-left: 4px solid hsl(var(--border));
          padding-left: 1em;
          margin: 1em 0;
          color: hsl(var(--muted-foreground));
        }
        .ql-editor pre {
          background: hsl(var(--muted));
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          color: hsl(var(--foreground));
        }
        .ql-editor code {
          background: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
          color: hsl(var(--foreground));
        }
        .ql-editor a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .ql-editor a:hover {
          opacity: 0.8;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
        }
        .ql-editor strong, .ql-editor b {
          color: hsl(var(--foreground));
        }
        .ql-editor em, .ql-editor i {
          color: hsl(var(--foreground));
        }
        .ql-editor hr {
          border-color: hsl(var(--border));
        }
        .ql-editor table {
          border-collapse: collapse;
          width: 100%;
        }
        .ql-editor th, .ql-editor td {
          border: 1px solid hsl(var(--border));
          padding: 0.5em;
          color: hsl(var(--foreground));
        }
        .ql-editor th {
          background: hsl(var(--muted));
        }
      `}</style>
    </div>
  );
}
