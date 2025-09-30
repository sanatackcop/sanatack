import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Eye, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Flashcard } from "./types";

export const StudyCard: React.FC<{
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  currentIndex: number;
  totalCards: number;
  onStarToggle: () => void;
}> = ({ flashcard, isFlipped, onFlip }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setShowExplanation(false);
  }, [flashcard.id]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.div
        className="w-full max-w-4xl h-[35rem] mx-2 relative cursor-pointer"
        onClick={onFlip}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <Button>Hint</Button>
            <Button>Show memory_aids</Button>
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <h2 className="text-xl font-medium leading-relaxed text-gray-800">
                  {flashcard.term || flashcard.front}
                </h2>

                {isFlipped && flashcard.examples && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExplanation(!showExplanation);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showExplanation ? "Hide Hints" : "Show Hints"}
                  </Button>
                )}

                {isFlipped && flashcard.memory_aids && <></>}
              </div>
            </CardContent>
          </Card>

          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border bg-gray-50/50"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="flex flex-col justify-center h-full p-8 space-y-4">
              <div className="text-center space-y-4">
                <p className="text-xl font-medium leading-relaxed text-gray-900">
                  {flashcard.definition || flashcard.back}
                </p>

                {/* Show explanation directly if it exists */}
                {flashcard.explanation && (
                  <>
                    <div className="w-16 h-px bg-gray-300 mx-auto" />
                    <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                      {flashcard.explanation}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {!isFlipped && (
        <Button
          onClick={onFlip}
          variant="outline"
          size="lg"
          className="min-w-32 rounded-xl"
        >
          <>
            <Eye className="w-4 h-4 mr-2" />
            Show Answer
          </>
        </Button>
      )}
    </div>
  );
};

// Enhanced Study Navigation with Difficulty Buttons
export const StudyNavigation: React.FC<{
  onDifficultySelect: (difficulty: number, difficultyLabel: string) => void;
  onFinish: () => void;
  isLast: boolean;
  isRevealed: boolean;
  currentCard?: Flashcard;
}> = ({ onDifficultySelect, onFinish, isLast, isRevealed }) => {
  const { t } = useTranslation();

  // Difficulty options matching spaced repetition patterns
  const difficultyOptions = [
    {
      key: 1,
      label: t("study.again", "Again"),
      apiLabel: "again",
      description: t("study.againDesc", "2 days"),
      color: "bg-red-500 hover:bg-red-600 text-white",
      shortcut: "1",
    },
    {
      key: 2,
      label: t("study.hard", "Hard"),
      apiLabel: "hard",
      description: t("study.hardDesc", "11 days"),
      color: "bg-orange-500 hover:bg-orange-600 text-white",
      shortcut: "2",
    },
    {
      key: 3,
      label: t("study.good", "Good"),
      apiLabel: "good",
      description: t("study.goodDesc", "about 1 month"),
      color: "bg-green-500 hover:bg-green-600 text-white",
      shortcut: "3",
    },
    {
      key: 4,
      label: t("study.easy", "Easy"),
      apiLabel: "easy",
      description: t("study.easyDesc", "4 months"),
      color: "bg-blue-500 hover:bg-blue-600 text-white",
      shortcut: "4",
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isRevealed) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        const option = difficultyOptions[key - 1];
        onDifficultySelect(option.key, option.apiLabel);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRevealed, onDifficultySelect, difficultyOptions]);

  if (!isRevealed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        {difficultyOptions.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => onDifficultySelect(option.key, option.apiLabel)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md relative group",
              option.color
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg mb-1">{option.label}</div>
            <div className="text-xs opacity-90 text-center">
              {option.description}
            </div>

            <div className="absolute top-2 right-2 w-6 h-6 bg-black/20 rounded-md flex items-center justify-center text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity">
              {option.shortcut}
            </div>
          </motion.button>
        ))}
      </div>

      {isLast && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onFinish}
            variant="outline"
            className="rounded-xl px-6"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("study.finishSession", "Finish Session")}
          </Button>
        </div>
      )}

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          {t(
            "study.keyboardHint",
            "Use keyboard shortcuts 1-4 or click the buttons"
          )}
        </p>
      </div>
    </motion.div>
  );
};
