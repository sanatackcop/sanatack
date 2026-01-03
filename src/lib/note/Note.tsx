import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { getWorkspaceNotesApi } from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Plus, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GenerationStatus } from "../types";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import { NoteView } from "./NoteView";
import NoteEditor from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Note, NoteListProps } from "./types";
import {
  createWorkspaceNoteApi,
  updateWorkspaceNoteApi,
  deleteWorkspaceNoteApi,
} from "@/utils/_apis/learnPlayground-api";

const POLL_INTERVAL_MS = 3500;

export function NoteList({ workspaceId }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";
  const isMountedRef = useRef(true);

  const handleCreateNote = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  }, []);

  const handleViewNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  }, []);

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      try {
        await deleteWorkspaceNoteApi(workspaceId, noteId);
        setRefresh((prev) => !prev);
        return;
      } catch (err) {
        console.error("Failed to delete note:", err);
        throw err;
      }
    },
    [workspaceId]
  );

  const handleCloseEditor = useCallback(() => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedNote(null);
  }, []);

  const handleSaveNote = useCallback(
    async (title: string, content: string) => {
      try {
        if (isCreating) {
          // Create new workspace note
          await createWorkspaceNoteApi(workspaceId, {
            title,
            content,
          });
          toast.success(t("note.created", "Note created successfully"));
        } else if (selectedNote) {
          // Update existing workspace note
          await updateWorkspaceNoteApi(workspaceId, selectedNote.id, {
            title,
            content,
          });
          toast.success(t("note.updated", "Note updated successfully"));
        }
        setRefresh((prev) => !prev);
        handleCloseEditor();
      } catch (err) {
        console.error("Failed to save note:", err);
        toast.error(t("note.saveFailed", "Failed to save note"));
        throw err;
      }
    },
    [isCreating, selectedNote, workspaceId, t, handleCloseEditor]
  );

  const anyActive = useMemo(
    () =>
      notes.some(
        (x) =>
          x.status === GenerationStatus.PENDING ||
          x.status === GenerationStatus.PROCESSING
      ),
    [notes]
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchNotes = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setLoading(true);
      try {
        const data = await getWorkspaceNotesApi(workspaceId);
        if (!isMountedRef.current) return;
        setNotes(data.notes ?? []);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Failed to fetch notes:", err);
        setNotes([]);
        setError("note.fetchError");
      } finally {
        if (!isMountedRef.current) return;
        if (!silent) setLoading(false);
      }
    },
    [workspaceId]
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchNotes();
  }, [fetchNotes, refresh]);

  useEffect(() => {
    if (!anyActive) return;
    const interval = window.setInterval(() => {
      fetchNotes({ silent: true });
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [anyActive, fetchNotes]);

  // Show editor for creating new note
  if (isCreating) {
    return (
      <NoteEditor
        onSave={handleSaveNote}
        onClose={handleCloseEditor}
        isNew
      />
    );
  }

  // Show editor for editing existing note
  if (isEditing && selectedNote) {
    return (
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onClose={handleCloseEditor}
      />
    );
  }

  // Show note view
  if (selectedNote && !isEditing) {
    return (
      <NoteView
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onSave={handleEditNote}
        onDelete={handleDeleteNote}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full">
      <ScrollArea className="h-full w-full">
        <motion.div
          key="list"
          dir={direction}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-full mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white">
              {t("note.list.title", "Notes")}
            </h3>
            <Button
              onClick={handleCreateNote}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("note.create", "New Note")}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-3 sm:p-4 h-28 sm:h-32 animate-pulse bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive dark:text-red-400 px-2">
              {t(error, "Failed to fetch notes. Please try again.")}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("note.empty.title", "No notes yet")}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {t(
                  "note.empty.description",
                  "Create your first note to start organizing your thoughts and ideas."
                )}
              </p>
              <Button onClick={handleCreateNote} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("note.createFirst", "Create your first note")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              {notes.map((note) => {
                const disabled =
                  note.status === GenerationStatus.PENDING ||
                  note.status === GenerationStatus.PROCESSING;
                const failed = note.status === GenerationStatus.FAILED;
                const hasStatus = note.status !== undefined;

                const noteTitle =
                  note.title || note.payload?.title || t("note.untitled", "Untitled Note");

                return (
                  <Card
                    key={note.id}
                    role="button"
                    aria-disabled={disabled}
                    aria-busy={disabled}
                    onClick={() => !disabled && !failed && handleViewNote(note)}
                    className={`group relative overflow-hidden w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col rounded-xl sm:rounded-2xl justify-center shadow-sm border transition-all duration-200 cursor-pointer ${
                      failed
                        ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800"
                        : "bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:border-gray-300/80 dark:hover:border-zinc-700"
                    } ${disabled ? "pointer-events-auto" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-2 sm:gap-3 min-w-0 w-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white break-words min-w-0 flex-1">
                            {noteTitle}
                          </h3>
                          {hasStatus && (
                            <div className="flex-shrink-0">
                              <StatusBadge status={note.status!} isRTL={isRTL} />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {failed && (
                      <div className="mt-3 w-full rounded-lg sm:rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-3 py-2 text-xs sm:text-sm flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">
                          {t(
                            "note.list.failure",
                            "Failed to save note. Please try again."
                          )}
                        </span>
                      </div>
                    )}

                    {note.status === GenerationStatus.PROCESSING && (
                      <div className="w-full">
                        <ProgressStrip />
                      </div>
                    )}
                    {note.status === GenerationStatus.PENDING && (
                      <div className="w-full">
                        <QueuedStrip />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
