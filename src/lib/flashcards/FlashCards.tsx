import { useEffect, useState, useCallback, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSkeleton, CARD_VARIANTS, ProgressIndicator } from "./consts";
import { FlashcardEditForm, FlashcardsList } from "./FlashcardsList";
import { StudyCard, StudyNavigation } from "./StudyCard";
import { FlashcardDeck, Flashcard } from "./types";
import GenerateContentComponent from "@/shared/workspaces/Generate";
import FlashcardModal from "@/shared/workspaces/modals/flashcardModal";
import { Badge } from "@/components/ui/badge";
import Card from "@mui/material/Card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const trackCardFlip = async (/*cardId: string, setId: string*/) => {
  try {
  } catch (error) {
    console.error("Error tracking flip:", error);
    throw error;
  }
};

const useFlashcards = (workspaceId: string) => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashCards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWorkSpaceContent(workspaceId);
      const cleanedResponse = response.flashcards.filter(
        (item): item is FlashcardDeck => item != null
      );
      setFlashcardSets(cleanedResponse);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("flashcards.fetchError");
      console.error("Error fetching flashcards:", err);
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchFlashCards();
  }, [fetchFlashCards]);

  return { flashcardSets, loading, error, refetch: fetchFlashCards };
};

const FlashCards: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { flashcardSets, loading, error, refetch } = useFlashcards(workspaceId);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSet, setActiveSet] = useState<FlashcardDeck | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [flipAttempts, setFlipAttempts] = useState<Record<string, number>>({});
  const [, setAnswerFeedback] = useState<any | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSetSelect = useCallback((set: FlashcardDeck) => {
    setActiveSet(set);
    setStudyMode(false);
    setStudyIndex(0);
    setFlipped(false);
    setFlippedCards(new Set());
    setFlipAttempts({});
    setAnswerFeedback(null);
  }, []);

  const handleDeleteSet = () => {
    console.log("Deleeting The Flashcards");
  };

  const handleStudyStart = useCallback(async () => {
    setStudyMode(true);
    setStudyIndex(0);
    setFlipped(false);
    setFlippedCards(new Set());
    setFlipAttempts({});
    setAnswerFeedback(null);

    if (activeSet?.id) {
      try {
        //! TODO
        // await resetStudySession(activeSet.id);
      } catch (error) {
        console.error("Failed to reset study session:", error);
      }
    }
  }, [activeSet]);

  const handleStudyStop = useCallback(() => {
    setStudyMode(false);
    setFlipped(false);
    setStudyIndex(0);
    setAnswerFeedback(null);
  }, []);

  const handleCardUpdate = useCallback(
    async (index: number, updates: Partial<Flashcard>) => {
      if (!activeSet) return;

      setActiveSet((prev) => {
        if (!prev) return prev;
        const newSet = { ...prev };
        newSet.flashcards[index] = { ...newSet.flashcards[index], ...updates };
        return newSet;
      });

      const flashcardId = activeSet.flashcards[index]?.id;
      if (flashcardId) {
        // await updateFlashcardData(flashcardId, activeSet.id, updates);
      }
    },
    [activeSet]
  );

  const handleDifficultySelect = useCallback(
    async (difficulty: number, _difficultyLabel: string) => {
      if (!activeSet) return;

      const currentCard = activeSet.flashcards[studyIndex];

      if (currentCard?.id) {
        //! TODO
        // await updateFlashcardDifficulty(
        //   currentCard.id,
        //   activeSet.id,
        //   difficultyLabel
        // );
      }

      const updatedSet = { ...activeSet };
      updatedSet.flashcards[studyIndex] = {
        ...updatedSet.flashcards[studyIndex],
        difficulty,
        reviewed: true,
        due: false,
      };
      setActiveSet(updatedSet);

      if (studyIndex === activeSet.flashcards.length - 1) {
        handleStudyStop();
      } else {
        setStudyIndex((prev) => prev + 1);
        setFlipped(false);
        setAnswerFeedback(null);
      }
    },
    [studyIndex, activeSet, handleStudyStop]
  );

  const handleStarToggle = useCallback(() => {
    if (!activeSet) return;

    const updatedSet = { ...activeSet };
    updatedSet.flashcards[studyIndex] = {
      ...updatedSet.flashcards[studyIndex],
      starred: !updatedSet.flashcards[studyIndex].starred,
    };
    setActiveSet(updatedSet);
  }, [activeSet, studyIndex]);

  const onFlip = useCallback(async () => {
    if (!activeSet) return;

    const currentCard = activeSet.flashcards[studyIndex];
    if (!currentCard) return;

    const cardId = currentCard.id;
    if (!cardId) {
      console.error("Card ID is missing, cannot flip the card.");
      return;
    }
    const hasBeenRevealed = flippedCards.has(cardId);

    if (hasBeenRevealed) {
      setFlipped((prev) => !prev);
      setFlipAttempts((prev) => ({
        ...prev,
        [cardId]: (prev[cardId] || 0) + 1,
      }));
      setAnswerFeedback(null);
      return;
    }

    try {
      await trackCardFlip(/* cardId, activeSet.id */);

      setFlipped(true);
      setFlippedCards((prev) => new Set(prev).add(cardId));
      setAnswerFeedback(null);

      await handleCardUpdate(studyIndex, {});
    } catch (error) {
      console.error("Failed to flip card:", error);
      setFlipped(true);
      setFlippedCards((prev) => new Set(prev).add(cardId));
      setAnswerFeedback(null);
    }
  }, [activeSet, studyIndex, flippedCards, flipAttempts, handleCardUpdate]);

  const handleCreatingNewFlashcard = useCallback(() => {
    setModalOpen(true);
  }, []);

  function handleClosingFlashcardModal(created?: boolean) {
    setModalOpen(false);
    if (created) refetch();
  }

  const anyActive = useMemo(
    () =>
      flashcardSets.some(
        (x) => x.status === "pending" || x.status === "processing"
      ),
    [flashcardSets]
  );

  if (loading) return <LoadingSkeleton />;
  if (error)
    return (
      <div className="text-center text-destructive" dir={direction}>
        {t(error, "Failed to fetch flashcards")}
      </div>
    );

  const totalCards = activeSet?.flashcards?.length || 0;
  const reviewedCount =
    activeSet?.flashcards?.filter((fc) => fc.reviewed || fc.due)?.length || 0;

  return (
    <div className="h-full flex flex-col" dir={direction}>
      <AnimatePresence mode="wait">
        {activeSet ? (
          <motion.div
            key="detail"
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            dir={direction}
            className="h-full flex flex-col w-full"
          >
            <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveSet(null)}
                className={cn(
                  "flex items-center rounded-2xl py-2 px-3 transition-all ease-linear duration-100 text-gray-400/50 hover:text-zinc-700 hover:bg-gray-50/50 drop-shadow-sm dark:hover:bg-zinc-100",
                  "group"
                )}
              >
                <BackIcon
                  className={cn("w-4 h-4 transition-all ease-out duration-200")}
                />
                <span className="text-sm">{t("common.back", "Back")}</span>
              </button>
            </div>

            {studyMode && totalCards > 0 && (
              <div className="flex-1 px-6">
                <div className="flex items-center justify-between px-16 my-2">
                  <div className="text-center w-full flex items-center gap-2">
                    <span>{studyIndex + 1}</span>
                    <Progress
                      value={((studyIndex + 1) / totalCards) * 100}
                      className="w-full h-2"
                    />
                    <span>{totalCards}</span>
                  </div>
                </div>

                <StudyCard
                  flashcard={activeSet.flashcards[studyIndex]}
                  isFlipped={flipped}
                  onFlip={onFlip}
                  currentIndex={studyIndex}
                  totalCards={totalCards}
                  onStarToggle={handleStarToggle}
                />

                <div className="mt-8">
                  <StudyNavigation
                    onDifficultySelect={handleDifficultySelect}
                    onFinish={handleStudyStop}
                    isLast={studyIndex === totalCards - 1}
                    isRevealed={flipped}
                    currentCard={activeSet.flashcards[studyIndex]}
                  />
                </div>
              </div>
            )}

            {!studyMode && (
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="flex flex-col items-center">
                    <ProgressIndicator
                      reviewed={reviewedCount}
                      total={totalCards}
                      onStartStudy={handleStudyStart}
                    />
                  </div>

                  <div className="space-y-2 px-16 sm:px-0 flex-col flex justify-center align-baseline">
                    <div className="flex w-full items-center justify-between">
                      <h2 className="text-[18px] text-zinc-900 font-medium dark:text-white">
                        {t("flashcards.titleWithCount", {
                          count: totalCards,
                          defaultValue: "Flashcards ({{count}})",
                        })}
                      </h2>
                    </div>

                    {activeSet.flashcards.map((flashcard: any, idx: number) => (
                      <Card
                        key={flashcard.id || idx}
                        className="!rounded-2xl !shadow-none border dark:border-zinc-100/10 dark:bg-zinc-900 dark:text-white"
                      >
                        <div className="mx-5 space-y-4 py-2">
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-opacity-75 text-zinc-800 dark:text-white flex items-center gap-2">
                                <span>
                                  {t("flashcards.cardNumber", {
                                    number: idx + 1,
                                    defaultValue: "Card {{number}}",
                                  })}
                                </span>
                                <Badge
                                  variant={"outline"}
                                  className="rounded-2xl"
                                >
                                  {flashcard.category}
                                </Badge>
                              </span>
                            </div>
                          </div>

                          <FlashcardEditForm
                            flashcard={flashcard}
                            onUpdate={(updates) =>
                              handleCardUpdate(idx, updates)
                            }
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <FlashcardsList
                sets={flashcardSets}
                onSelectSet={handleSetSelect}
                onDeleteSet={handleDeleteSet}
              />
              <GenerateContentComponent
                title={t("flashcards.generate.title", "Create Flashcards")}
                description={t(
                  "flashcards.generate.description",
                  "Quickly generate a flashcard set based on your topic of interest."
                )}
                disabled={anyActive}
                buttonLabel={t("flashcards.generate.button", "Generate")}
                onClick={handleCreatingNewFlashcard}
                dir={direction}
              />
            </ScrollArea>
          </div>
        )}
      </AnimatePresence>

      <FlashcardModal
        open={modalOpen}
        onClose={handleClosingFlashcardModal}
        workspaceId={workspaceId}
        anyActive={anyActive}
      />
    </div>
  );
};

export default FlashCards;
