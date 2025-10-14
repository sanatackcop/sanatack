import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Flashcard } from "./types";

const isTypingElement = (el: EventTarget | null) =>
  !!(
    el &&
    el instanceof HTMLElement &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.getAttribute("contenteditable") === "true")
  );

export const StudyCard: React.FC<{
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  currentIndex: number;
  totalCards: number;
  onStarToggle: () => void;
}> = ({ flashcard, isFlipped, onFlip }) => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Hints state (front side) ---
  const allHints = useMemo(() => {
    const hints: string[] = [];
    if (flashcard?.memory_aids?.length) hints.push(...flashcard.memory_aids);
    if (flashcard?.examples?.length) hints.push(...flashcard.examples);
    return hints;
  }, [flashcard]);

  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [showAllHints, setShowAllHints] = useState(false);

  const visibleHints = useMemo(() => {
    if (showAllHints) return allHints;
    return allHints.slice(0, revealedHintCount);
  }, [allHints, revealedHintCount, showAllHints]);

  const revealNextHint = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (revealedHintCount < allHints.length) {
        setRevealedHintCount((c) => c + 1);
      }
    },
    [allHints.length, revealedHintCount]
  );

  const revealAllHints = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setShowAllHints(true);
      setRevealedHintCount(allHints.length);
    },
    [allHints.length]
  );

  useEffect(() => {
    wrapperRef.current?.focus();
  }, [isFlipped, flashcard?.id]);

  // reset hints when card flips back to front or card changes
  useEffect(() => {
    if (!isFlipped) {
      setRevealedHintCount(0);
      setShowAllHints(false);
    }
  }, [isFlipped, flashcard?.id]);

  // --- Explanation state (back side) ---
  const [showExplanation, setShowExplanation] = useState(false);
  useEffect(() => {
    // close explanation when we flip to another side/card
    setShowExplanation(false);
  }, [isFlipped, flashcard?.id]);
  useEffect(() => {
    setShowExplanation(false);
  }, [isFlipped, flashcard?.id]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.div
        ref={wrapperRef}
        tabIndex={0}
        role="button"
        aria-label="Study card"
        onKeyDown={(e) => {
          e.stopPropagation();
          if (isTypingElement(e.target)) return;

          if (isFlipped && (e.key === "e" || e.key === "E")) {
            e.preventDefault();
            setShowExplanation((s) => !s);
          }
          if (!isFlipped && (e.key === "h" || e.key === "H")) {
            e.preventDefault();
            if (allHints.length > 0) {
              if (revealedHintCount < allHints.length)
                setRevealedHintCount((c) => c + 1);
              else setShowAllHints(true);
            }
          }
        }}
        onClick={onFlip}
        className="w-full max-w-4xl h-[35rem] mx-2 relative cursor-pointer"
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {/* FRONT */}
          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <CardContent className="flex items-center justify-center h-full p-8 relative w-full">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {!!allHints.length && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={revealNextHint}
                      className="rounded-lg"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {t("study.hint", "Hint")}
                      {allHints.length > 1 && revealedHintCount > 0
                        ? ` (${revealedHintCount}/${allHints.length})`
                        : ""}
                    </Button>
                    {allHints.length > 1 &&
                      revealedHintCount < allHints.length && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={revealAllHints}
                          className="rounded-lg"
                        >
                          {t("study.revealAll", "Reveal all")}
                        </Button>
                      )}
                  </>
                )}
              </div>

              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-xl font-medium leading-relaxed text-gray-800">
                  {flashcard.term || flashcard.front}
                </h2>

                {/* Progressive hints */}
                <AnimatePresence initial={false}>
                  {visibleHints.length > 0 && (
                    <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm text-left shadow-sm">
                        <div className="flex items-center mb-2 gap-2 font-medium">
                          <Sparkles className="w-4 h-4" />
                          {t("study.hints", "Hints")}
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          {visibleHints.map((h, i) => (
                            <li key={i} className="leading-relaxed">
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* BACK */}
          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="flex flex-col justify-center h-full p-8 space-y-4 w-full">
              <div className="text-center space-y-4">
                {flashcard.examples && (
                  <div
                    className="rotate-180 max-w-2xl mx-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {showExplanation && (
                      <div className="mt-4 rounded-xl border  p-4 text-sm text-gray-700 leading-relaxed shadow-sm">
                        {flashcard.examples}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xl font-medium rotate-180 leading-relaxed text-gray-900">
                  {flashcard.definition || flashcard.back}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="text-xs text-muted-foreground">
        {!isFlipped
          ? allHints.length != revealedHintCount
            ? t("study.hintShortcut", "Press H for hint")
            : t("study.allHintsRevealed", "All Hints revealed")
          : t("study.examplesShortcut", "Press E for explanation")}
      </div>
    </div>
  );
};

export const StudyNavigation: React.FC<{
  onDifficultySelect: (difficulty: number, difficultyLabel: string) => void;
  onFinish: () => void;
  isLast: boolean;
  isRevealed: boolean;
  currentCard?: Flashcard;
}> = ({ onDifficultySelect, onFinish, isLast, isRevealed }) => {
  const { t } = useTranslation();

  const buttonBase =
    "inline-flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const tones = {
    difficult:
      "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 focus:ring-rose-500",
    hard: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500",
    good: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-500",
    easy: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-500",
  };

  // Your options with consistent, light styling
  const difficultyOptions = [
    {
      key: 1,
      label: t("study.good", "Good"),
      apiLabel: "good",
      color: `${buttonBase} ${tones.good}`,
      shortcut: "1",
    },
    {
      key: 2,
      label: t("study.easy", "Easy"),
      apiLabel: "easy",
      color: `${buttonBase} ${tones.easy}`,
      shortcut: "2",
    },
    {
      key: 3,
      label: t("study.hard", "Hard"),
      apiLabel: "hard",
      color: `${buttonBase} ${tones.hard}`,
      shortcut: "3",
    },
    {
      key: 4,
      label: t("study.difficult", "Difficult"),
      apiLabel: "difficult",
      color: `${buttonBase} ${tones.difficult}`,
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
      className="w-full max-w-2xl flex items-center mx-auto"
    >
      <div className="w-full flex justify-center">
        <motion.button
          onClick={() => onDifficultySelect(2, "good")}
          className=" text-gray-900 border mx-auto  border-gray-300 rounded-xl px-4 py-2 font-medium shadow-sm hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next
        </motion.button>
        {isLast && (
          <Button
            onClick={onFinish}
            variant="outline"
            className=" text-gray-900 border mx-auto  border-gray-300 rounded-xl px-4 py-2 font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("study.finishSession", "Finish Session")}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
