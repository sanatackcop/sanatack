import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Settings2 } from "lucide-react";

import { createNewQuizApi } from "@/utils/_apis/learnPlayground-api";
import { getErrorMessage } from "@/pages/dashboard/utils";

import { Card } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LANGUAGES } from "../types";
import { QuizType } from "./types";

type Props = {
  workspaceId: string;
  anyActive: boolean;
  setRefresh: () => void;
};

const MIN_Q = 5;
const MAX_Q = 16;
const QUIZ_TYPES: { value: QuizType; label: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True / False" },
  { value: "scenario", label: "Scenario" },
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
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const { t } = useTranslation();
  const disabled = generating || anyActive || !workspaceId;

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
      setCountError(t("quiz.countInvalid", "Enter a valid number"));
      return;
    }
    const c = clamp(n);
    setCount(c);
    setCountError(
      c !== n
        ? t("quiz.countRange", `Please choose between ${MIN_Q} and ${MAX_Q}`)
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
        t("quiz.selectAtLeastOneType", "Select at least one question type")
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
    t,
    setRefresh,
  ]);

  return (
    <>
      <Card className="relative z-0 mx-5 px-4 py-2 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
        <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
          <div className="max-w-[65%]">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              {t("quiz.createTitle", "Create Quiz")}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t(
                "quiz.createSubtitle",
                "Create quiz sets with preferred types, difficulty, and focus."
              )}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      disabled={generating || anyActive}
                      className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Settings2 className="mr-2 h-4 w-4" />
                      {t("generate", "Generate")}
                    </Button>
                  </span>
                </TooltipTrigger>
                {anyActive && (
                  <TooltipContent>
                    {t(
                      "quiz.activeBlock",
                      "Please finish the active generation first"
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("quiz.optionsTitle", "Create Quiz Options")}
            </DialogTitle>
            <DialogDescription>
              {t("quiz.optionsDesc", "Set options for the new quiz.")}
            </DialogDescription>
          </DialogHeader>

          {/* Question Types */}
          <div className="space-y-2">
            <Label>{t("quiz.types", "Question Types")}</Label>
            <div className="flex flex-wrap gap-2">
              {QUIZ_TYPES.map((qt) => {
                const checked = selectedTypes.includes(qt.value);
                return (
                  <label
                    key={qt.value}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none transition-colors ${
                      checked
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleType(qt.value, v)}
                      aria-label={qt.label}
                    />
                    <span className="text-sm">{qt.label}</span>
                  </label>
                );
              })}
            </div>
            {selectedTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((tkey) => (
                  <Badge key={tkey} variant="secondary" className="capitalize">
                    {tkey.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {t(
                  "quiz.typesHelp",
                  "Choose one or more types (e.g., Multiple Choice, True/False, Scenario)."
                )}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty-select">
                {t("quiz.difficulty", "Difficulty")}
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
                      {d[0].toUpperCase() + d.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count-input">
                {t("quiz.questionsCount", "Number of questions")}
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
                <p className="text-xs text-red-600">{countError}</p>
              )}
            </div>
          </div>

          <Separator />
          <div className="space-y-2">
            <Label htmlFor="language-select">
              {t("language.label", "Language")}
            </Label>
            <Select
              value={language}
              onValueChange={(val: any) => setLanguage(val)}
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

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="focus-input">
              {t("quiz.focus", "Focus (optional)")}
            </Label>
            <Textarea
              id="focus-input"
              value={focus || ""}
              placeholder={t(
                "quiz.focusPlaceholder",
                "e.g. arrays, pointers, error handling"
              )}
              onChange={(e) => setFocus(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleCreateQuiz();
                }
              }}
              disabled={generating}
            />
            <p className="text-xs text-muted-foreground">
              {t(
                "quiz.focusHelp",
                "Tell us what to prioritize. Leave empty for a general quiz."
              )}
            </p>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={generating}
            >
              {t("cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleCreateQuiz}
              disabled={disabled || !!countError || selectedTypes.length === 0}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Settings2 className="h-4 w-4 animate-spin" />
                  {t("generating", "Generating…")}
                </>
              ) : (
                <>
                  <Settings2 className="h-4 w-4" />
                  {t("create", "Create")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
