import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { DeleteModalState, Flashcard, FlashcardDeck } from "./types";
import { GenerationStatus } from "../types";
import { getFlashCardInputs, InputConfig } from "./consts";
import { Textarea } from "@/components/ui/textarea";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";

export const FlashcardsList: React.FC<{
  sets: FlashcardDeck[];
  onSelectSet: (set: FlashcardDeck) => void;
  onDeleteSet?: (setId: string) => void;
}> = ({ sets, onSelectSet, onDeleteSet }) => {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    setToDelete: null,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isEmpty = sets.length === 0;

  const openDelete = (set: FlashcardDeck) => {
    setDeleteError(null);
    setDeleteModal({ isOpen: true, setToDelete: set });
  };

  const handleCancelDelete = () => {
    if (deletingId) return;
    setDeleteError(null);
    setDeleteModal({ isOpen: false, setToDelete: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.setToDelete) return;
    const id = deleteModal.setToDelete.id;
    setDeleteError(null);
    setDeletingId(id);
    try {
      // await deleteFlashcardDeck(id);
      onDeleteSet?.(id);
      setDeleteModal({ isOpen: false, setToDelete: null });
    } catch (err: any) {
      setDeleteError(
        err?.message ||
          t("flashcards.list.deleteFailed", "Failed to delete the set.")
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="px-6 py-4 flex flex-col rounded-3xl justify-between space-y-3">
          <h3 className="px-2 text-sm font-medium text-gray-700 dark:text-white">
            {t("flashcards.list.title", "My Flashcards")}
          </h3>

          {isEmpty ? (
            <></>
          ) : (
            <div className="space-y-3">
              {sets.map((set) => {
                const disabled =
                  set.status === GenerationStatus.PENDING ||
                  set.status === GenerationStatus.PROCESSING ||
                  deletingId === set.id;
                const failed = set.status === GenerationStatus.FAILED;
                const completed = set.status === GenerationStatus.COMPLETED;
                const isDeleting = deletingId === set.id;

                return (
                  <Card
                    key={set.id}
                    role="button"
                    aria-disabled={disabled}
                    aria-busy={disabled}
                    onClick={() => !disabled && !failed && onSelectSet(set)}
                    className={`group relative overflow-hidden px-6 py-5 flex flex-col rounded-2xl justify-center shadow-sm border transition-all duration-200 cursor-pointer ${
                      failed
                        ? "bg-red-50/50 border-red-200 hover:border-red-300"
                        : "bg-white  border-gray-200/60 hover:border-gray-300/80"
                    } ${disabled ? "pointer-events-auto" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {set.title}
                          </h3>
                          <StatusBadge status={set.status} />
                          {isDeleting && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              {t("common.deleting", "Deleting…")}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {set.categories?.map((category) => (
                            <Badge
                              key={`${set.id}-${category}`}
                              variant="secondary"
                              className="rounded-full font-medium text-[11px] px-2.5 py-1 bg-gray-100 text-gray-700"
                            >
                              {category}
                            </Badge>
                          ))}
                          {completed && set.flashcards && (
                            <span
                              className={cn(
                                "text-xs text-gray-500",
                                isRTL ? "mr-1" : "ml-1"
                              )}
                            >
                              {set.flashcards.length}{" "}
                              {t("flashcards.cardsLabel", "cards")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDeleting) openDelete(set);
                          }}
                          disabled={isDeleting}
                          className={`p-2 rounded-full border transition-colors ${
                            failed
                              ? "border-red-200 text-red-600 hover:bg-red-100"
                              : "border-gray-200 text-gray-500 hover:bg-gray-100"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                          title={t("common.delete", "Delete")}
                          aria-label={t("common.delete", "Delete")}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {failed && (
                      <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {t(
                            "flashcards.list.failed",
                            "Generation failed. You can delete this set and try again."
                          )}
                        </span>
                      </div>
                    )}

                    {set.status === GenerationStatus.PROCESSING && (
                      <ProgressStrip />
                    )}
                    {set.status === GenerationStatus.PENDING && <QueuedStrip />}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <Modal
        description={t(
          "flashcards.list.deleteWarning",
          "Are you sure you want to delete this flashcard set? This action cannot be undone."
        )}
        title={t("common.confirmDelete", "Confirm Delete")}
        open={deleteModal.isOpen}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      >
        {deleteError && (
          <div className="mt-2 mb-1 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{deleteError}</span>
          </div>
        )}
      </Modal>
    </>
  );
};

export const FlashcardEditForm: React.FC<{
  flashcard: Flashcard;
  onUpdate: (updates: Partial<Flashcard>) => void;
}> = ({ flashcard, onUpdate }) => {
  const { t } = useTranslation();
  const inputs = useMemo(() => getFlashCardInputs(t), [t]);
  const [showOptions, setShowOptions] = useState(false);

  const renderField = (field: InputConfig) => (
    <div className="grid gap-2" key={field.key}>
      <Textarea
        label={field.label}
        required={field.required}
        value={field.getValue(flashcard)}
        onChange={(e) => onUpdate(field.onChange(e.target.value))}
        draggable={field.key === "term"}
        rows={3}
        readOnly
        className="h-24 resize-none overflow-y-auto justify-start shadow-sm rounded-xl"
        placeholder={field.placeholder}
      />
    </div>
  );

  const requiredFields = inputs.filter((f) => !f.optional);
  const optionalFields = inputs.filter((f) => f.optional);

  return (
    <div className="grid gap-4">
      {requiredFields.map(renderField)}

      {!showOptions ? (
        <Button
          type="button"
          variant="ghost"
          className="justify-start w-fit px-0 muted-foreground hover:text-foreground rounded-xl text-xs text-zinc-400/70 hover:text-zinc-800"
          onClick={() => setShowOptions(true)}
        >
          <span className="px-2">
            {t("flashcards.showMoreOptions", "Show more options")}
          </span>
        </Button>
      ) : (
        <div className="grid gap-4">
          {optionalFields.map(renderField)}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="justify-start w-fit bg-transparent !shadow-none muted-foreground hover:text-foreground rounded-xl text-xs text-zinc-400/70 hover:text-zinc-800"
              onClick={() => setShowOptions(false)}
            >
              {t("flashcards.hideOptions", "Hide options")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
