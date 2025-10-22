import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { createFlashcard } from "@/utils/_apis/learnPlayground-api";
import { getErrorMessage } from "@/pages/dashboard/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { LANGUAGES } from "../types";

type Props = {
  open: boolean;
  onClose: (created?: boolean) => void;
  workspaceId: string;
  anyActive: boolean;
};

const MIN_CARDS = 5;
const MAX_CARDS = 16;

export default function FlashcardModal({
  open,
  onClose,
  workspaceId,
  anyActive,
}: Props) {
  const { t } = useTranslation();

  const [generating, setGenerating] = useState(false);
  const [count, setCount] = useState<number>(8);
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const [focus, setFocus] = useState<string>("");
  const [countError, setCountError] = useState<string | null>(null);

  const disabled = generating || anyActive || !workspaceId;

  const clampCount = (n: number) =>
    Math.max(MIN_CARDS, Math.min(MAX_CARDS, Math.floor(n)));

  const validateAndSetCount = (raw: string) => {
    // Allow empty while typing
    if (raw.trim() === "") {
      setCountError(null);
      setCount(NaN as any);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      setCountError(t("flashcards.countInvalid", "Enter a valid number"));
      return;
    }
    const clamped = clampCount(n);
    if (n !== clamped) {
      setCountError(
        t(
          "flashcards.countRange",
          `Please choose between ${MIN_CARDS} and ${MAX_CARDS}`
        )
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

  const handleCreate = useCallback(async () => {
    if (disabled) return;

    // Final guard for count
    const finalCount = Number.isFinite(count) ? clampCount(count) : MIN_CARDS;
    setCount(finalCount);

    setGenerating(true);
    try {
      // POST with payload
      await createFlashcard(workspaceId, finalCount, language, focus?.trim());

      toast.success(t("flashcards.created", "Flashcard deck created"));
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
  }, [disabled, count, workspaceId, language, focus, t, onClose]);

  const onOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("createFlashcardSet", "Create Flashcard Set")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "selectCustomizeFlashcardSet",
              "Select specific concepts and customize your flashcard set"
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Focus / Topic */}
        <div className="space-y-1">
          <Label htmlFor="focus-input">
            {t("focus.label", "Focus (optional)")}
          </Label>
          <Textarea
            id="focus-input"
            value={focus}
            placeholder={t(
              "focus.placeholder",
              "e.g. pointers, memory management, or dynamic arrays"
            )}
            onChange={(e) => setFocus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleCreate();
              }
            }}
            disabled={generating}
          />
          <p className="text-xs text-muted-foreground">
            {t(
              "focus.help",
              "Tell us what to prioritize. Leave empty for a general deck."
            )}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="count-input">
              {t("count.label", "Number of cards")}
            </Label>
            <Input
              id="count-input"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
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
              {t("language.label", "Language")}
            </Label>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={generating}
            >
              <SelectTrigger id="language-select">
                <SelectValue
                  placeholder={t("language.placeholder", "Select language")}
                />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang, ind) => (
                  <SelectItem key={ind} value={lang.value}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={generating}
          >
            {t("cancel", "Cancel")}
          </Button>

          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    disabled={disabled || !!countError}
                    onClick={handleCreate}
                    className="gap-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                        {t("generating", "Generating…")}
                      </>
                    ) : (
                      <>
                        <Settings2 className="h-4 w-4" />
                        {t("generate", "Generate")}
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {anyActive && (
                <TooltipContent>
                  {t(
                    "flashcards.activeBlock",
                    "Please finish the active generation first"
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
