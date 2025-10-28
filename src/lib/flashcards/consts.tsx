import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircularProgressProps, Flashcard } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

export const updateFlashcardDifficulty = async (
  flashcardId: string,
  setId: string,
  difficultyLevel: string
) => {
  try {
    const response = await fetch("/api/flashcards/update-difficulty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flashcardId,
        setId,
        difficultyLevel,
        clickAndView: true,
        timestamp: new Date().toISOString(),
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update flashcard difficulty:", error);
    return false;
  }
};

export const updateFlashcardData = async (
  flashcardId: string,
  setId: string,
  updates: Partial<Flashcard>
) => {
  try {
    const response = await fetch("/api/flashcards/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flashcardId,
        setId,
        updates,
        timestamp: new Date().toISOString(),
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to update flashcard data:", error);
    return false;
  }
};

export const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export interface InputConfig {
  key: string;
  label: string;
  getValue: (f: Flashcard) => string;
  onChange: (val: string) => Partial<Flashcard>;
  placeholder: string;
  optional: boolean;
  required?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  reviewed,
  total,
  size = 140,
  strokeWidth = 12,
  className,
}) => {
  const { t } = useTranslation();
  const percentage = total > 0 ? (reviewed / total) * 100 : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-green-500 transition-all duration-700 ease-out"
          style={{
            filter: "drop-shadow(0 0 6px rgba(34, 197, 94, 0.3))",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{reviewed}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{t("flashcards.of", "of")}</span>
          <span className="font-medium">{total}</span>
        </div>
      </div>
    </div>
  );
};

export const ProgressIndicator: React.FC<{
  reviewed: number;
  total: number;
  onStartStudy: () => void;
}> = ({ /* reviewed, */ total, onStartStudy }) => {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  // const toReview = total - reviewed;

  return (
    <div
      className="flex flex-col items-center space-y-6 py-8"
      dir={direction}
    >
      {/* <CircularProgress
        reviewed={reviewed}
        total={total}
        size={140}
        strokeWidth={12}
      /> */}

      {/* <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <Card className="text-center flex flex-col items-center justify-center p-4 bg-muted/30">
          <div className="text-2xl font-bold text-muted-foreground mb-1">
            {toReview}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Not Studied
          </div>
        </Card>

        <Card className="text-center p-4 bg-green-50 dark:bg-green-950/20 border border-green-400/50">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {reviewed}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            To Review
          </div>
        </Card>
      </div> */}

      <div className="w-full max-w-sm">
        <Button
          size="lg"
          className="w-full rounded-full py-3 font-semibold"
          onClick={onStartStudy}
          disabled={total === 0}
        >
          {t("flashcards.studyButton", "Study Cards")}
        </Button>
      </div>
    </div>
  );
};

export const getFlashCardInputs = (t: TFunction): InputConfig[] => [
  {
    key: "term",
    label: t("flashcards.inputs.term.label", "Term"),
    getValue: (f: Flashcard) => f.term || f.front || "",
    onChange: (val: string) => ({ term: val, front: val }),
    placeholder: t("flashcards.inputs.term.placeholder", "Enter term..."),
    optional: false,
    required: true,
  },
  {
    key: "definition",
    required: true,
    label: t("flashcards.inputs.definition.label", "Definition"),
    getValue: (f: Flashcard) => f.definition || f.back || "",
    onChange: (val: string) => ({ definition: val, back: val }),
    placeholder: t(
      "flashcards.inputs.definition.placeholder",
      "Enter definition..."
    ),
    optional: false,
  },
  {
    key: "example",
    label: t("flashcards.inputs.example.label", "Example"),
    getValue: (f: Flashcard) => {
      const examples = Array.isArray(f.examples) ? f.examples[0] : f.examples;
      return examples || "";
    },
    onChange: (val: string) => ({ explanation: val, examples: [val] }),
    placeholder: t(
      "flashcards.inputs.example.placeholder",
      "Add context or example..."
    ),
    optional: true,
    required: false,
  },
];

export const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
