import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw, Settings2, Info } from "lucide-react";
import { toast } from "sonner";
import { createFlashcard } from "@/utils/_apis/learnPlayground-api";
import { getErrorMessage } from "@/pages/dashboard/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Modal from "@/components/Modal";
import { LANGUAGES } from "@/lib/types";

export type FlashcardModalProps = {
  open: boolean;
  onClose: (created?: boolean) => void;
  workspaceId: string;
  anyActive: boolean;
};

const MIN_CARDS = 5;
const MAX_CARDS = 100;

export default function FlashcardModal({
  open,
  onClose,
  workspaceId,
  anyActive,
}: FlashcardModalProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";
  const initialLanguage = i18n.language?.startsWith("ar") ? "ar" : "en";

  const [generating, setGenerating] = useState(false);
  const [count, setCount] = useState<number>(8);
  const [language, setLanguage] =
    useState<"en" | "ar">(initialLanguage);
  const [focus, setFocus] = useState<string | null>(null);
  const [countError, setCountError] = useState<string | null>(null);

  const clampCount = (n: number) =>
    Math.max(MIN_CARDS, Math.min(MAX_CARDS, Math.floor(n)));

  const validateAndSetCount = (raw: string) => {
    if (raw.trim() === "") {
      setCountError(null);
      setCount(NaN as any);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      setCountError(
        t("flashcards.modal.count.invalid", {
          defaultValue: "Enter a valid number",
        })
      );
      return;
    }
    const clamped = clampCount(n);
    if (n !== clamped) {
      setCountError(
        t("flashcards.modal.count.range", {
          min: MIN_CARDS,
          max: MAX_CARDS,
          defaultValue: "Please choose between {{min}} and {{max}}",
        })
      );
    } else {
      setCountError(null);
    }
    setCount(clamped);
  };

  const onCountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    const clamped = clampCount(Number.isFinite(n) ? n : MIN_CARDS);
    setCount(clamped);
    setCountError(null);
  };

  const disabled = generating || anyActive || !workspaceId;

  const handleCreate = useCallback(async () => {
    if (disabled || !!countError) return;

    const finalCount = Number.isFinite(count) ? clampCount(count) : MIN_CARDS;
    setCount(finalCount);

    setGenerating(true);
    try {
      await createFlashcard(workspaceId, finalCount, language, focus);
      toast.success(
        t("flashcards.modal.created", "Flashcard deck created")
      );
      onClose(true);
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.loadSpaces",
        "Failed Creating Flashcard Deck."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Failed Creating Flashcard Deck: ", err);
      onClose();
    } finally {
      setGenerating(false);
    }
  }, [disabled, countError, count, workspaceId, language, focus, t, onClose]);

  const onOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  return (
    <Modal
      dir={direction}
      className={isRTL ? "text-right" : undefined}
      open={open}
      onOpenChange={onOpenChange}
      title={t("flashcards.modal.title", "Create Flashcard Set")}
      description={t(
        "flashcards.modal.description",
        "Select specific concepts and customize your flashcard set."
      )}
      variant="default"
      confirmLabel={
        generating ? (
          <span className="inline-flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            {t("flashcards.modal.generating", "Generating…")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            {t("common.generate", "Generate")}
          </span>
        )
      }
      cancelLabel={t("common.cancel", "Cancel")}
      onConfirm={handleCreate}
      onCancel={() => onClose()}
      isConfirmLoading={generating}
    >
      {/* Focus / Topic */}
      <div className="space-y-1">
        <Label htmlFor="focus-input">
          {t("flashcards.modal.focus.label", "Focus (optional)")}
        </Label>
        <Textarea
          id="focus-input"
          value={focus || ""}
          placeholder={t(
            "flashcards.modal.focus.placeholder",
            "e.g. pointers, memory management, or dynamic arrays"
          )}
          onChange={(e) => setFocus(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleCreate();
            }
          }}
          disabled={generating}
          dir={direction}
        />
        <p className="text-xs text-muted-foreground">
          {t(
            "flashcards.modal.focus.help",
            "Tell us what to prioritize. Leave empty for a general deck."
          )}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="count-input">
            {t("flashcards.modal.count.label", "Number of cards")}
          </Label>
          <Input
            id="count-input"
            type="number"
            inputMode="numeric"
            min={MIN_CARDS}
            max={MAX_CARDS}
            step={1}
            value={Number.isFinite(count) ? String(count) : ""}
            onChange={(e) => validateAndSetCount(e.target.value)}
            onBlur={onCountBlur}
            placeholder={`${MIN_CARDS}–${MAX_CARDS}`}
            disabled={generating}
          />
          {countError && <p className="text-xs text-red-600">{countError}</p>}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language-select">
            {t("flashcards.modal.language.label", "Language")}
          </Label>
          <Select
            value={language}
            onValueChange={(val: any) => setLanguage(val)}
            disabled={generating}
          >
            <SelectTrigger id="language-select" dir={direction}>
              <SelectValue
                placeholder={t("flashcards.modal.language.placeholder", "Select language")}
              />
            </SelectTrigger>
            <SelectContent dir={direction}>
              {LANGUAGES.map((lang, ind) => (
                <SelectItem key={ind} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {anyActive && (
        <div className="flex items-start gap-2 mt-10 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
          <Info className="h-4 w-4 mt-0.5" />
          <span>
            {t(
              "flashcards.modal.activeBlock",
              "Please finish the active generation first"
            )}
          </span>
        </div>
      )}

      {disabled && !anyActive && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                {t("flashcards.modal.hint", "Fill the form to enable generation")}
              </span>
            </TooltipTrigger>
            <TooltipContent dir={direction}>
              {t(
                "flashcards.modal.hintDetail",
                "Provide required inputs to proceed"
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Modal>
  );
}
