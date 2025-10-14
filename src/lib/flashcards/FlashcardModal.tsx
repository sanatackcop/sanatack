import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { createFlashcard } from "@/utils/_apis/learnPlayground-api";
export default function FlashcardModal({
  open,
  onClose,
  workspaceId,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
}) {
  const { t } = useTranslation();

  const handleFlashcardCreation = () => {
    createFlashcard(workspaceId);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center  justify-center z-50"
      style={{ backdropFilter: "blur(1px)" }}
    >
      <div className="rounded-xl shadow-xl max-w-lg w-full p-7 relative bg-white">
        <button
          className="absolute top-4 right-4 text-gray-500 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="font-semibold text-lg mb-1">
          {t("createFlashcardSet", "Create Flashcard Set")}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {t(
            "selectCustomizeFlashcardSet",
            "Select specific concepts and customize your flashcard set"
          )}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={() => handleFlashcardCreation()}
            className="bg-black text-white hover:bg-gray-700"
          >
            {t("createSet", "Create Set")}
          </Button>
        </div>
      </div>
    </div>
  );
}
