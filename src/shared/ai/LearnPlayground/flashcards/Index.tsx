import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { getWorkSpaceFlashcards } from "@/utils/_apis/learnPlayground-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Star,
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  ChevronRight,
  RotateCcw,
  Settings2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FlashcardModal from "./FlashcardModal";
import flashcards from "@/assets/flashcards.svg";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Flashcard {
  id?: string;
  term?: string;
  front?: string;
  definition?: string;
  back?: string;
  explanation?: string;
  examples?: string[];
  memory_aids?: string[];
  reviewed?: boolean;
  due?: boolean;
  starred?: boolean;
}

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  categories: string[];
  flashcards: Flashcard[];
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Circular Progress Component
interface CircularProgressProps {
  reviewed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  reviewed,
  total,
  size = 140,
  strokeWidth = 12,
  className,
}) => {
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
          <span>of</span>
          <span className="font-medium">{total}</span>
        </div>
      </div>
    </div>
  );
};

// Custom Hooks
const useFlashcards = (workspaceId: string) => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashCards = useCallback(async () => {
    try {
      setLoading(true);
      const response: FlashcardSet[] = await getWorkSpaceFlashcards(
        workspaceId
      );
      setFlashcardSets(response);
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

// Progress Indicator with Circular Design
const ProgressIndicator: React.FC<{
  reviewed: number;
  total: number;
  onStartStudy: () => void;
}> = ({ reviewed, total, onStartStudy }) => {
  const toReview = total - reviewed;

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      {/* Circular Progress */}
      <CircularProgress
        reviewed={reviewed}
        total={total}
        size={140}
        strokeWidth={12}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <Card className="text-center p-4 bg-muted/30">
          <div className="text-2xl font-bold text-muted-foreground mb-1">
            {toReview}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50"></div>
            Not Studied
          </div>
        </Card>

        <Card className="text-center p-4 bg-green-50 dark:bg-green-950/20">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {reviewed}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            To Review
          </div>
        </Card>
      </div>

      {/* Study Button */}
      <div className="w-full max-w-sm">
        <Button
          size="lg"
          className="w-full rounded-full py-3 font-semibold"
          onClick={onStartStudy}
          disabled={total === 0}
        >
          Study Cards
        </Button>
      </div>
    </div>
  );
};

const FlashcardEditForm: React.FC<{
  flashcard: Flashcard;
  onUpdate: (updates: Partial<Flashcard>) => void;
}> = ({ flashcard, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Term</label>
        <Input
          value={flashcard.term || flashcard.front || ""}
          onChange={(e) =>
            onUpdate({ term: e.target.value, front: e.target.value })
          }
          placeholder="Enter term..."
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Definition</label>
        <Textarea
          value={flashcard.definition || flashcard.back || ""}
          onChange={(e) =>
            onUpdate({ definition: e.target.value, back: e.target.value })
          }
          placeholder="Enter definition..."
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Explanation (Optional)</label>
        <Input
          value={flashcard.explanation || flashcard.examples?.[0] || ""}
          onChange={(e) =>
            onUpdate({
              explanation: e.target.value,
              examples: [e.target.value],
            })
          }
          placeholder="Add context or example..."
        />
      </div>
    </div>
  );
};

const StudyCard: React.FC<{
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  currentIndex: number;
  totalCards: number;
}> = ({ flashcard, isFlipped, onFlip, currentIndex, totalCards }) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Card {currentIndex + 1} of {totalCards}
        </p>
        <Progress
          value={((currentIndex + 1) / totalCards) * 100}
          className="w-64 h-1"
        />
      </div>

      <motion.div
        className="w-full h-96 mx-2 relative cursor-pointer"
        onClick={onFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Front */}
          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border-2 shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <CardContent className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <h2 className="text-md leading-relaxed">
                  {flashcard.term || flashcard.front}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="absolute inset-0 w-full h-full flex items-center justify-center border-2 shadow-lg bg-muted/10"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="flex flex-col justify-center h-full p-6 space-y-3">
              <div className="text-center space-y-3">
                <p className="text-lg font-medium leading-relaxed">
                  {flashcard.definition || flashcard.back}
                </p>
                {flashcard.explanation && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {flashcard.explanation}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Button onClick={onFlip} variant="outline" size="lg" className="min-w-32">
        {isFlipped ? (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Answer
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Reveal Answer
          </>
        )}
      </Button>
    </div>
  );
};

const StudyNavigation: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLast: boolean;
  isRevealed: boolean;
}> = ({
  onNext,
  onPrevious,
  onFinish,
  canGoNext,
  canGoPrevious,
  isLast,
  isRevealed,
}) => {
  return (
    <div className="flex gap-3 justify-center">
      {/* <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        size="lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button> */}

      {/* {isRevealed && (
        <Button
          onClick={isLast ? onFinish : onNext}
          disabled={!canGoNext && !isLast}
          size="lg"
          className="min-w-24"
        >
          {isLast ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              Finish
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )} */}
    </div>
  );
};

const FlashcardsList: React.FC<{
  sets: FlashcardSet[];
  onSelectSet: (set: FlashcardSet) => void;
  onCreateNew: () => void;
}> = ({ sets, onSelectSet, onCreateNew }) => {
  const { t } = useTranslation();
  console.log({ sets });
  sets.map((set) => console.log({ set }));
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
    >
      {sets.length > 0 && (
        <div className="px-6 py-4 mb-4 flex flex-col rounded-3xl justify-between space-y-2">
          <h3 className="px-2 text-sm font-medium">My Flashcards</h3>
          {sets.length === 0 ? (
            <div className="mx-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="px-4 py-2 h-40">
                  <Skeleton className="h-6 w-40 mb-3" />
                  <Skeleton className="h-4 w-60 mb-1" />
                  <Skeleton className="h-3 w-48 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </Card>
              ))}
            </div>
          ) : (
            sets.map((set, idx) => (
              <Card
                key={set.id || idx}
                onClick={() => onSelectSet(set)}
                className="px-6 py-4  flex flex-col rounded-3xl justify-center hover:bg-gray-100/60 cursor-pointer shadow-sm"
              >
                <h3 className="font-medium text-md">{set.title}</h3>
                <div className="w-full flex justify-start items-center">
                  <div>
                    <div className="text-xs text-gray-500">
                      {set.categories?.map((category) => (
                        <Badge
                          variant={"secondary"}
                          className="rounded-3xl font-medium gap-10"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
      <Card className="mx-5 px-4 py-2 h-[25rem] flex flex-col justify-between">
        <div className="flex items-start justify-between mx-2 px-4 py-5">
          <div>
            <h2>{t("common.createFlashCard")}</h2>
            <p className="text-gray-400/50 text-sm">
              {t(
                "common.createFlashCardDescription",
                "Create a flashcard set with custom setting and personalization"
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-3xl" onClick={onCreateNew}>
              <Settings2 />
              {t("common.generate") || "Generate"}
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <img src={flashcards} alt="Flashcards" />
        </div>
      </Card>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => (
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

const FlashCards: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { flashcardSets, loading, error } = useFlashcards(workspaceId);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleSetSelect = useCallback((set: FlashcardSet) => {
    setActiveSet(set);
    setStudyMode(false);
    setStudyIndex(0);
    setFlipped(false);
  }, []);

  const handleStudyStart = useCallback(() => {
    setStudyMode(true);
    setStudyIndex(0);
    setFlipped(false);
  }, []);

  const handleStudyStop = useCallback(() => {
    setStudyMode(false);
    setFlipped(false);
    setStudyIndex(0);
  }, []);

  const handleCardUpdate = useCallback(
    (index: number, updates: Partial<Flashcard>) => {
      if (!activeSet) return;

      setActiveSet((prev) => {
        if (!prev) return prev;
        const newSet = { ...prev };
        newSet.flashcards[index] = { ...newSet.flashcards[index], ...updates };
        return newSet;
      });
    },
    [activeSet]
  );

  const handleNext = useCallback(() => {
    if (!activeSet) return;

    if (studyIndex === activeSet.flashcards.length - 1) {
      handleStudyStop();
    } else {
      setStudyIndex((prev) => prev + 1);
      setFlipped(false);
    }
  }, [studyIndex, activeSet, handleStudyStop]);

  const handlePrevious = useCallback(() => {
    if (studyIndex > 0) {
      setStudyIndex((prev) => prev - 1);
      setFlipped(false);
    }
  }, [studyIndex]);

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
            className="h-full flex flex-col"
          >
            <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0">
              <div
                className="flex group items-center text-gray-400/50 cursor-pointer hover:bg-gray-50/50 drop-shadow-sm hover:text-zinc-700 rounded-2xl py-2 px-3 transition-all ease-linear duration-100"
                onClick={() => setActiveSet(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all ease-out duration-200" />
                Back
              </div>
            </div>

            {studyMode && totalCards > 0 && (
              <div className="flex-1 px-6">
                <StudyCard
                  flashcard={activeSet.flashcards[studyIndex]}
                  isFlipped={flipped}
                  onFlip={() => setFlipped((prev) => !prev)}
                  currentIndex={studyIndex}
                  totalCards={totalCards}
                />
                <div className="mt-8">
                  <StudyNavigation
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onFinish={handleStudyStop}
                    canGoNext={studyIndex < totalCards - 1}
                    canGoPrevious={studyIndex > 0}
                    isLast={studyIndex === totalCards - 1}
                    isRevealed={flipped}
                  />
                </div>
              </div>
            )}

            {!studyMode && (
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <FlashCardHome
                    totalCards={totalCards}
                    activeSet={activeSet}
                    handleCardUpdate={handleCardUpdate}
                  />
                </ScrollArea>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <FlashcardsList
                sets={flashcardSets.flashcards}
                onSelectSet={handleSetSelect}
                onCreateNew={() => setModalOpen(true)}
              />
            </ScrollArea>
          </div>
        )}
      </AnimatePresence>

      <FlashcardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default FlashCards;

export function FlashCardHome({
  totalCards,
  activeSet,
  handleCardUpdate,
}: {
  totalCards: number;
  activeSet: any;
  handleCardUpdate: any;
}) {
  return (
    <>
      {/* <CardContent className="p-0">
                      <div className="flex flex-col items-center">
                        <ProgressIndicator
                          reviewed={reviewedCount}
                          total={totalCards}
                          onStartStudy={handleStudyStart}
                        />
                      </div>
                    </CardContent> */}

      <div className="space-y-2 px-16 flex-col flex justify-center align-baseline">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[18px] text-zinc-900 font-medium">
            Flashcards <span className="text-sm">({totalCards})</span>
          </h2>
          <Button
            variant={"outline"}
            className="rounded-3xl border-dashed border-2 border-gray-300/50 text-sm shadow-none font-medium"
          >
            <Plus />
            Add Cards
          </Button>
        </div>

        {/* FlashCardsList */}
        {activeSet.flashcards.map((flashcard, idx) => (
          <Card key={flashcard.id || idx}>
            <div className="flex items-center justify-between mx-5">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400/50 font-medium">
                  Card {idx + 1}
                </span>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
              <Button variant="ghost" size="icon" className="py-2 px-2">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* <FlashcardEditForm
              flashcard={flashcard}
              onUpdate={(updates) => handleCardUpdate(idx, updates)}
            /> */}
          </Card>
        ))}
      </div>
    </>
  );
}
