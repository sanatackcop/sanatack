import React, { useEffect, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  updateFlashcardData,
  updateFlashcardDifficulty,
  LoadingSkeleton,
  CARD_VARIANTS,
} from "./consts";
import FlashcardModal from "./FlashcardModal";
import { FlashcardsList } from "./FlashcardsList";
import { StudyCard, StudyNavigation } from "./StudyCard";
import { FlashcardDeck, Flashcard } from "./types";
import { FlashCardHome } from "./FlashCardsHome";

const trackCardFlip = async (cardId: string, setId: string) => {
  try {
    const response = await fetch(`/api/flashcards/${cardId}/flip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setId,
        flippedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to track flip");
    }

    return await response.json();
  } catch (error) {
    console.error("Error tracking flip:", error);
    throw error;
  }
};

const resetStudySession = async (setId: string) => {
  try {
    const response = await fetch(
      `/api/flashcards/sets/${setId}/reset-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetAt: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reset session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error resetting session:", error);
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
      setError("Failed to fetch flashcards");
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

  const handleSetSelect = useCallback((set: FlashcardDeck) => {
    setActiveSet(set);
    setStudyMode(false);
    setStudyIndex(0);
    setFlipped(false);
    setFlippedCards(new Set());
    setFlipAttempts({});
  }, []);

  const handleStudyStart = useCallback(async () => {
    setStudyMode(true);
    setStudyIndex(0);
    setFlipped(false);
    setFlippedCards(new Set());
    setFlipAttempts({});

    if (activeSet?.id) {
      try {
        await resetStudySession(activeSet.id);
      } catch (error) {
        console.error("Failed to reset study session:", error);
      }
    }
  }, [activeSet]);

  const handleStudyStop = useCallback(() => {
    setStudyMode(false);
    setFlipped(false);
    setStudyIndex(0);
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
        await updateFlashcardData(flashcardId, activeSet.id, updates);
      }
    },
    [activeSet]
  );

  const handleDifficultySelect = useCallback(
    async (difficulty: number, difficultyLabel: string) => {
      if (!activeSet) return;

      const currentCard = activeSet.flashcards[studyIndex];

      if (currentCard?.id) {
        await updateFlashcardDifficulty(
          currentCard.id,
          activeSet.id,
          difficultyLabel
        );
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
      return;
    }

    try {
      await trackCardFlip(cardId, activeSet.id);

      setFlipped(true);
      setFlippedCards((prev) => new Set(prev).add(cardId));

      await handleCardUpdate(studyIndex, {});
    } catch (error) {
      console.error("Failed to flip card:", error);
      setFlipped(true);
      setFlippedCards((prev) => new Set(prev).add(cardId));
    }
  }, [activeSet, studyIndex, flippedCards, flipAttempts, handleCardUpdate]);

  const handleCreatingNewFlashcard = useCallback(() => {
    setModalOpen(true);
  }, []);

  function handleClosingFlashcardModal(created?: boolean) {
    setModalOpen(false);
    if (created) refetch();
  }

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center text-destructive">{error}</div>;

  const totalCards = activeSet?.flashcards?.length || 0;
  const reviewedCount =
    activeSet?.flashcards?.filter((fc) => fc.reviewed || fc.due)?.length || 0;

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {activeSet ? (
          <motion.div
            key="detail"
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full flex flex-col w-full"
          >
            <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0 ">
              <div
                className="flex group items-center text-gray-400/50 cursor-pointer hover:bg-gray-50/50 drop-shadow-sm hover:text-zinc-700 rounded-2xl py-2 px-3 transition-all ease-linear duration-100"
                onClick={() => setActiveSet(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all ease-out duration-200" />
                <span className="text-sm">Back</span>
              </div>
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
              <div className="flex-1 min-h-0 bg-white">
                <ScrollArea className="h-full px-6 pb-6">
                  <FlashCardHome
                    totalCards={totalCards}
                    activeSet={activeSet}
                    handleCardUpdate={handleCardUpdate}
                    reviewedCount={reviewedCount}
                    handleStudyStart={handleStudyStart}
                  />
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
                onCreateNew={handleCreatingNewFlashcard}
              />
            </ScrollArea>
          </div>
        )}
      </AnimatePresence>

      <FlashcardModal
        open={modalOpen}
        onClose={handleClosingFlashcardModal}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default FlashCards;
