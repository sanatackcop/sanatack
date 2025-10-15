import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Settings2 } from "lucide-react";
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
import { DeleteModalState, Flashcard, FlashcardSet } from "./types";
import { FlashCardsInputs, InputConfig } from "./consts";

export const FlashcardsList: React.FC<{
  sets: FlashcardSet[];
  onSelectSet: (set: FlashcardSet) => void;
  onCreateNew: () => void;
  onDeleteSet?: (setId: string) => void;
}> = ({ sets, onSelectSet, onCreateNew, onDeleteSet }) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    setToDelete: null,
  });

  const handleConfirmDelete = () => {
    if (deleteModal.setToDelete && onDeleteSet) {
      onDeleteSet(deleteModal.setToDelete.id);
    }
    setDeleteModal({ isOpen: false, setToDelete: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, setToDelete: null });
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
        {sets.length > 0 && (
          <div className="px-6 py-4 mb-4 flex flex-col rounded-3xl justify-between space-y-3">
            <h3 className="px-2 text-sm font-medium text-gray-700">
              {t("common.myFlashcards", "My Flashcards")}
            </h3>
            {sets.length === 0 ? (
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
                {sets.map((set, idx) => (
                  <Card
                    key={set.id || idx}
                    onClick={() => onSelectSet(set)}
                    className="group relative px-6 py-5 flex flex-col rounded-2xl justify-center hover:bg-gradient-to-r hover:from-gray-50 ease-in
                     hover:to-gray-100/80 cursor-pointer shadow-sm border border-gray-200/60 hover:border-gray-300/80 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg text-gray-900 mb-2">
                          {set.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {set.categories?.map((category, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="rounded-full font-medium text-xs px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              {category}
                            </Badge>
                          ))}
                          {set.flashcards && (
                            <span className="text-xs text-gray-500 ml-2">
                              {set.flashcards.length}{" "}
                              {t("common.cards", "cards")}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteClick(e, set)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-100 hover:text-red-600 
                          text-gray-400 transition-all duration-200 absolute top-4 right-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button> */}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

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
                  {deleteModal.setToDelete.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="rounded-xl"
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common.delete", "Delete")}
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
