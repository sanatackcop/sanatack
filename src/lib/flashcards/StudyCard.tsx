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
import { Lightbulb, Sparkles, X, Check } from "lucide-react";
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
}> = ({ flashcard, isFlipped, onFlip, currentIndex, totalCards }) => {
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
    setShowExplanation(false);
  }, [isFlipped, flashcard?.id]);

  // Create stacked card effect with better visibility
  const stackedCards = [];
  const maxVisibleCards = Math.min(4, totalCards - currentIndex);

  for (let i = 0; i < maxVisibleCards; i++) {
    const scale = 1 - i * 0.03;
    const y = i * 12;
    const rotateZ = i * 1.5;
    const opacity = i === 0 ? 1 : 0.4;

    stackedCards.push(
      <motion.div
        key={`stack-${i}`}
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{
          scale,
          y,
          rotateZ,
          opacity,
          zIndex: 10 - i,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          pointerEvents: i === 0 ? "auto" : "none",
          transformOrigin: "center bottom",
        }}
      >
        {i === 0 ? (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            {/* FRONT */}
            <Card
              className="absolute inset-0 w-full h-full flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <CardContent className="flex items-center justify-center h-full p-8 relative w-full">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {!!allHints.length && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={revealNextHint}
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {t("flashcards.hint", "Hint")}
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
                            className="rounded-lg border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            {t("common.revealAll", "Reveal all")}
                          </Button>
                        )}
                    </>
                  )}
                </div>

                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {flashcard.term || flashcard.front}
                  </h2>

                  {/* Progressive hints */}
                  <AnimatePresence initial={false}>
                    {visibleHints.length > 0 && (
                      <motion.div
                        className="mt-6"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-amber-900 dark:text-amber-200 text-sm text-left shadow-sm">
                          <div className="flex items-center mb-2 gap-2 font-medium">
                            <Sparkles className="w-4 h-4" />
                            {t("flashcards.hints", "Hints")}
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            {visibleHints.map((h, i) => (
                              <li key={i} className="leading-relaxed">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* BACK */}
            <Card
              className="absolute inset-0 w-full h-full flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="flex flex-col justify-center h-full p-8 space-y-4 w-full">
                <div className="text-center space-y-4">
                  {flashcard.examples && showExplanation && (
                    <div
                      className="rotate-180 max-w-2xl mx-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.div
                        className="mt-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {flashcard.examples}
                      </motion.div>
                    </div>
                  )}

                  <p className="text-lg font-medium rotate-180 leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {flashcard.definition || flashcard.back}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="absolute inset-0 w-full h-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl" />
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 pb-8">
      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700">
        {currentIndex + 1} / {totalCards}
      </div>

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
        className="w-full max-w-3xl h-[26rem] mx-2 relative cursor-pointer perspective-1000"
        style={{ perspective: "1000px" }}
      >
        {stackedCards}
      </motion.div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        {!isFlipped
          ? allHints.length != revealedHintCount
            ? t("flashcards.pressH", "Press H for hint • Click to flip")
            : t("flashcards.clickReveal", "Click to reveal answer")
          : t("flashcards.pressE", "Press E for explanation")}
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
}> = ({ onDifficultySelect, isRevealed }) => {
  const { t } = useTranslation();

  const handleDifficulty = useCallback(
    (difficulty: number, label: string) => {
      onDifficultySelect(difficulty, label);
    },
    [onDifficultySelect]
  );

  useEffect(() => {
    if (!isRevealed) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "1") {
        handleDifficulty(3, "hard");
      } else if (e.key === "ArrowRight" || e.key === "2") {
        handleDifficulty(1, "good");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRevealed, handleDifficulty]);

  if (!isRevealed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-center gap-4 px-4"
    >
      <Button
        onClick={() => handleDifficulty(3, "hard")}
        className="group bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>{t("flashcards.bad", "Bad")}</span>
        </div>
      </Button>

      <Button
        onClick={() => handleDifficulty(1, "good")}
        className="group bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{t("flashcards.good", "Good")}</span>
        </div>
      </Button>
    </motion.div>
  );
};
