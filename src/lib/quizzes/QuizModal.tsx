import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Settings2 } from "lucide-react";
import { createNewQuizApi } from "@/utils/_apis/learnPlayground-api";
import { getErrorMessage } from "@/pages/dashboard/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "../types";
import { QuizType } from "./types";
import GenerateContentComponent from "@/shared/workspaces/Generate";
import { cn } from "@/lib/utils";

type Props = {
  workspaceId: string;
  anyActive: boolean;
  setRefresh: () => void;
};

const MIN_Q = 5;
const MAX_Q = 16;
const QUIZ_TYPES: { value: QuizType; defaultLabel: string }[] = [
  { value: "multiple_choice", defaultLabel: "Multiple Choice" },
  { value: "true_false", defaultLabel: "True / False" },
  { value: "scenario", defaultLabel: "Scenario" },
];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export default function QuizModal({
  workspaceId,
  anyActive,
  setRefresh,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<QuizType[]>([]);
  const [difficulty, setDifficulty] =
    useState<(typeof DIFFICULTIES)[number]>("medium");
  const [count, setCount] = useState<number>(8);
  const [focus, setFocus] = useState<string | null>(null);
  const [countError, setCountError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";
  const initialLanguage = i18n.language?.startsWith("ar") ? "ar" : "en";
  const [language, setLanguage] = useState<"en" | "ar">(initialLanguage);
  const disabled = generating || anyActive || !workspaceId;

  const typeLabel = useCallback(
    (value: QuizType) => {
      const fallback =
        QUIZ_TYPES.find((qt) => qt.value === value)?.defaultLabel ??
        value.replace(/_/g, " ");
      return t(`quizzes.modal.types.${value}`, fallback);
    },
    [t]
  );

  const difficultyLabel = useCallback(
    (value: (typeof DIFFICULTIES)[number]) =>
      t(`quizzes.modal.difficulties.${value}`, value),
    [t]
  );

  const toggleType = (qt: QuizType, checked: boolean | string) => {
    const isChecked = checked === true || checked === "indeterminate";
    setSelectedTypes((prev) => {
      if (isChecked) {
        if (prev.includes(qt)) return prev;
        return [...prev, qt];
      }
      return prev.filter((x) => x !== qt);
    });
  };

  const clamp = (n: number) => Math.max(MIN_Q, Math.min(MAX_Q, Math.floor(n)));

  const validateAndSetCount = (raw: string) => {
    if (raw.trim() === "") {
      setCount(NaN as any);
      setCountError(null);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      setCountError(t("quizzes.modal.count.invalid", "Enter a valid number"));
      return;
    }
    const c = clamp(n);
    setCount(c);
    setCountError(
      c !== n
        ? t("quizzes.modal.count.range", {
            min: MIN_Q,
            max: MAX_Q,
            defaultValue: `Please choose between ${MIN_Q} and ${MAX_Q}`,
          })
        : null
    );
  };

  const onCountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    const c = clamp(Number.isFinite(n) ? n : MIN_Q);
    setCount(c);
    setCountError(null);
  };

  const handleCreateQuiz = useCallback(async () => {
    if (disabled) return;

    if (selectedTypes.length === 0) {
      toast.error(
        t(
          "quizzes.modal.selectAtLeastOneType",
          "Select at least one question type"
        )
      );
      return;
    }

    const finalCount = Number.isFinite(count) ? clamp(count) : MIN_Q;
    setCount(finalCount);

    setGenerating(true);
    try {
      setIsModalOpen(false);
      await createNewQuizApi({
        id: workspaceId,
        language,
        question_types: selectedTypes,
        count: finalCount,
        difficulty,
        focus,
      });

      setRefresh();
      setSelectedTypes([]);
      setFocus("");
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.loadSpaces",
        "Failed Creating Quiz."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg);
      console.error("Failed Creating Quiz.", err);
    } finally {
      setGenerating(false);
    }
  }, [
    disabled,
    selectedTypes,
    count,
    difficulty,
    focus,
    workspaceId,
    language,
    t,
    setRefresh,
  ]);

  return (
    <>
      <GenerateContentComponent
        title={t("quizzes.generate.title", "Create Quiz")}
        description={t(
          "quizzes.generate.description",
          "Create quiz sets with preferred types, difficulty, and focus."
        )}
        buttonLabel={t("quizzes.generate.button", "Generate")}
        onClick={() => setIsModalOpen(true)}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          dir={direction}
          className={cn("sm:max-w-lg", isRTL && "text-right")}
        >
          <DialogHeader>
            <DialogTitle>
              {t("quizzes.modal.title", "Create Quiz Options")}
            </DialogTitle>
            <DialogDescription>
              {t("quizzes.modal.description", "Set options for the new quiz.")}
            </DialogDescription>
          </DialogHeader>

          {/* Question Types with Dark Mode */}
          <div className="space-y-2">
            <Label>{t("quizzes.modal.types.label", "Question Types")}</Label>
            <div className="flex flex-wrap gap-2">
              {QUIZ_TYPES.map((qt) => {
                const checked = selectedTypes.includes(qt.value);
                return (
                  <label
                    key={qt.value}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none transition-colors",
                      checked
                        ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100"
                        : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleType(qt.value, v)}
                      aria-label={typeLabel(qt.value)}
                    />
                    <span className="text-sm">{typeLabel(qt.value)}</span>
                  </label>
                );
              })}
            </div>
            {selectedTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((tkey) => (
                  <Badge key={tkey} variant="secondary" className="capitalize">
                    {typeLabel(tkey)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {t(
                  "quizzes.modal.types.help",
                  "Choose one or more types (e.g., Multiple Choice, True/False, Scenario)."
                )}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty-select">
                {t("quizzes.modal.difficulty.label", "Difficulty")}
              </Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as typeof difficulty)}
                disabled={generating}
              >
                <SelectTrigger id="difficulty-select">
                  <SelectValue
                    placeholder={t(
                      "quiz.chooseDifficulty",
                      "Choose difficulty"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {difficultyLabel(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count-input">
                {t("quizzes.modal.count.label", "Number of questions")}
              </Label>
              <Input
                id="count-input"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={MIN_Q}
                max={MAX_Q}
                step={1}
                value={Number.isFinite(count) ? String(count) : ""}
                onChange={(e) => validateAndSetCount(e.target.value)}
                onBlur={onCountBlur}
                placeholder={`${MIN_Q}–${MAX_Q}`}
                disabled={generating}
              />
              {countError && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {countError}
                </p>
              )}
            </div>
          </div>

          <Separator />
          <div className="space-y-2">
            <Label htmlFor="language-select">
              {t("quizzes.modal.language.label", "Language")}
            </Label>
            <Select
              value={language}
              onValueChange={(val: any) => setLanguage(val)}
              disabled={generating}
            >
              <SelectTrigger id="language-select" dir={direction}>
                <SelectValue
                  placeholder={t(
                    "quizzes.modal.language.placeholder",
                    "Select language"
                  )}
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

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="focus-input">
              {t("quizzes.modal.focus.label", "Focus (optional)")}
            </Label>
            <Textarea
              id="focus-input"
              value={focus || ""}
              placeholder={t(
                "quizzes.modal.focus.placeholder",
                "e.g. arrays, pointers, error handling"
              )}
              onChange={(e) => setFocus(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleCreateQuiz();
                }
              }}
              disabled={generating}
              dir={direction}
            />
            <p className="text-xs text-muted-foreground">
              {t(
                "quizzes.modal.focus.help",
                "Tell us what to prioritize. Leave empty for a general quiz."
              )}
            </p>
          </div>

          <DialogFooter
            className={cn(
              "flex items-center justify-end gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={generating}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleCreateQuiz}
              disabled={disabled || !!countError || selectedTypes.length === 0}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Settings2 className="h-4 w-4 animate-spin" />
                  {t("quizzes.modal.generating", "Generating…")}
                </>
              ) : (
                <>
                  <Settings2 className="h-4 w-4" />
                  {t("quizzes.modal.create", "Create")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
