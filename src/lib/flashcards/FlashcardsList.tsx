import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2, Settings2, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import flashcards from "@/assets/flashcards.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteModalState, Flashcard, FlashcardDeck } from "./types";
import { GenerationStatus } from "../types";
import { FlashCardsInputs, InputConfig } from "./consts";
import { Textarea } from "@/components/ui/textarea";
import { deleteFlashcardDeck } from "@/utils/_apis/learnPlayground-api";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";

export const FlashcardsList: React.FC<{
  sets: FlashcardDeck[];
  onSelectSet: (set: FlashcardDeck) => void;
  onCreateNew: () => void;
  onDeleteSet?: (setId: string) => void; // parent removes set from its state
}> = ({ sets, onSelectSet, onCreateNew, onDeleteSet }) => {
  const { t } = useTranslation();

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
      await deleteFlashcardDeck(id);
      onDeleteSet?.(id);
      setDeleteModal({ isOpen: false, setToDelete: null });
    } catch (err: any) {
      setDeleteError(
        err?.message || t("common.deleteFailed", "Failed to delete the set.")
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
        <div className="px-6 py-4 mb-4 flex flex-col rounded-3xl justify-between space-y-3">
          <h3 className="px-2 text-sm font-medium text-gray-700">
            {t("common.myFlashcards", "My Flashcards")}
          </h3>

          {isEmpty ? (
            <div className="mx-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="px-4 py-2 h-40 animate-pulse">
                  <Skeleton className="h-6 w-40 mb-3" />
                  <Skeleton className="h-4 w-60 mb-1" />
                  <Skeleton className="h-3 w-48 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </Card>
              ))}
            </div>
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
                        : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 border-gray-200/60 hover:border-gray-300/80"
                    } ${disabled ? "pointer-events-auto" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
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
                            <span className="text-xs text-gray-500 ml-1">
                              {set.flashcards.length}{" "}
                              {t("common.cards", "cards")}
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

                    {/* Failed banner */}
                    {failed && (
                      <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {t(
                            "flashcards.failed",
                            "Generation failed. You can delete this set and try again."
                          )}
                        </span>
                      </div>
                    )}

                    {/* Deleting overlay */}
                    {isDeleting && (
                      <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-[1px] pointer-events-none" />
                    )}

                    {/* Status overlays */}
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

        {/* Create New */}
        <Card className="relative z-0 mx-5 px-4 py-2 h-[25rem] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
          <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
            <div className="max-w-[65%]">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                {t("common.createFlashCard", "Create Flashcards")}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(
                  "common.createFlashCardDescription",
                  "Create a flashcard set with custom settings and personalization"
                )}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
                onClick={onCreateNew}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                {t("common.generate", "Generate")}
              </Button>
            </div>
          </div>

          <div
            className="pointer-events-none select-none absolute -left-20 bottom-0 z-0 opacity-90"
            aria-hidden
          >
            <img
              src={flashcards}
              alt="Flashcards"
              className="block h-auto w-[22rem] md:w-[26rem] lg:w-[30rem] translate-x-[20px] translate-y-1/4"
            />
          </div>
        </Card>
      </motion.div>

      {/* Delete confirm */}
      <Dialog open={deleteModal.isOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              {t("common.confirmDelete", "Confirm Delete")}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {t(
                "common.deleteWarning",
                "Are you sure you want to delete this flashcard set? This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>

          {deleteModal.setToDelete && (
            <div className="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <p className="font-medium text-gray-900">
                {deleteModal.setToDelete.title}
              </p>
              {deleteModal.setToDelete.categories && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {deleteModal.setToDelete.categories.map((category) => (
                    <Badge
                      key={`${deleteModal.setToDelete!.id}-${category}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API error (if any) */}
          {deleteError && (
            <div className="mt-2 mb-1 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{deleteError}</span>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="rounded-xl"
              disabled={!!deletingId}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60"
              disabled={!!deletingId}
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.deleting", "Deleting…")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("common.delete", "Delete")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FlashcardEditForm: React.FC<{
  flashcard: Flashcard;
  onUpdate: (updates: Partial<Flashcard>) => void;
}> = ({ flashcard, onUpdate }) => {
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

  const requiredFields = FlashCardsInputs.filter((f) => !f.optional);
  const optionalFields = FlashCardsInputs.filter((f) => f.optional);

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
          <span className="px-2">Show more options</span>
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
              Hide options
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
