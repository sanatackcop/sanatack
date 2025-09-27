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
  ArrowLeft,
  BookOpen,
  EyeOff,
  Settings2,
  Plus,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FlashcardModal from "./FlashcardModal";
import flashcards from "@/assets/flashcards.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// Config for the inputs
const FlashCardsInputs = [
  {
    key: "term",
    label: "Term",
    getValue: (f: Flashcard) => f.term || f.front || "",
    onChange: (val: string) => ({ term: val, front: val }),
    placeholder: "Enter term...",
    optional: false,
    required: true,
  },
  {
    key: "definition",
    required: true,
    label: "Definition",
    getValue: (f: Flashcard) => f.definition || f.back || "",
    onChange: (val: string) => ({ definition: val, back: val }),
    placeholder: "Enter definition...",
    optional: false,
  },
  {
    key: "explanation",
    label: "Explanation",
    getValue: (f: Flashcard) => f.explanation || f.examples?.[0] || "",
    onChange: (val: string) => ({ explanation: val, examples: [val] }),
    placeholder: "Add context or example...",
    optional: true,
    required: false,
  },
] as const;

type InputConfig = (typeof FlashCardsInputs)[number];

export const FlashcardEditForm: React.FC<{
  flashcard: Flashcard;
  onUpdate: (updates: Partial<Flashcard>) => void;
}> = ({ flashcard, onUpdate }) => {
  const [showOptions, setShowOptions] = useState(false);

  const renderField = (field: InputConfig) => (
    <div className="grid gap-2" key={field.key}>
      <Textarea
        label={field.label}
        required={field.required}
        value={field.getValue(flashcard)}
        onChange={(e) => onUpdate(field.onChange(e.target.value))}
        draggable={field.key === "term"}
        rows={3}
        className="h-24 resize-none overflow-y-auto justify-start shadow-sm rounded-xl"
        placeholder={field.placeholder}
      />
    </div>
  );

  const requiredFields = FlashCardsInputs.filter((f) => !f.optional);
  const optionalFields = FlashCardsInputs.filter((f) => f.optional);

  return (
    <div className="grid gap-4">
      {requiredFields.map(renderField)}

      {!showOptions ? (
        <Button
          type="button"
          variant="ghost"
          className="justify-start w-fit px-0 muted-foreground hover:text-foreground rounded-xl text-xs text-zinc-400/70 hover:text-zinc-800"
          onClick={() => setShowOptions(true)}
        >
          <span className="px-2">Show more options</span>
        </Button>
      ) : (
        <div className="grid gap-4">
          {optionalFields.map(renderField)}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="justify-start w-fit bg-transparent !shadow-none  muted-foreground hover:text-foreground rounded-xl text-xs text-zinc-400/70 hover:text-zinc-800"
              onClick={() => setShowOptions(false)}
            >
              Hide options
            </Button>
          </div>
        </div>
      )}
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

interface DeleteModalState {
  isOpen: boolean;
  setToDelete: FlashcardSet | null;
}

const FlashcardsList: React.FC<{
  sets: FlashcardSet[];
  onSelectSet: (set: FlashcardSet) => void;
  onCreateNew: () => void;
  onDeleteSet?: (setId: string) => void;
}> = ({ sets, onSelectSet, onCreateNew, onDeleteSet }) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    setToDelete: null,
  });

  const handleDeleteClick = (e: React.MouseEvent, set: FlashcardSet) => {
    e.stopPropagation(); // Prevent card click
    setDeleteModal({ isOpen: true, setToDelete: set });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.setToDelete && onDeleteSet) {
      onDeleteSet(deleteModal.setToDelete.id);
    }
    setDeleteModal({ isOpen: false, setToDelete: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, setToDelete: null });
  };

  console.log({ sets });
  sets.map((set) => console.log({ set }));

  return (
    <>
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        {sets.length > 0 && (
          <div className="px-6 py-4 mb-4 flex flex-col rounded-3xl justify-between space-y-3">
            <h3 className="px-2 text-sm font-medium text-gray-700">
              {t("common.myFlashcards", "My Flashcards")}
            </h3>
            {sets.length === 0 ? (
              <div className="mx-5 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="px-4 py-2 h-40 animate-pulse">
                    <Skeleton className="h-6 w-40 mb-3" />
                    <Skeleton className="h-4 w-60 mb-1" />
                    <Skeleton className="h-3 w-48 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sets.map((set, idx) => (
                  <Card
                    key={set.id || idx}
                    onClick={() => onSelectSet(set)}
                    className="group relative px-6 py-5 flex flex-col rounded-2xl justify-center hover:bg-gradient-to-r hover:from-gray-50 ease-in
                     hover:to-gray-100/80 cursor-pointer shadow-sm border border-gray-200/60 hover:border-gray-300/80 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {set.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {set.categories?.map((category, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="rounded-full font-medium text-xs px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              {category}
                            </Badge>
                          ))}
                          {set.flashcards && (
                            <span className="text-xs text-gray-500 ml-2">
                              + {set.flashcards.length - 2}{" "}
                              {t("common.cards", "cards")}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteClick(e, set)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-100 hover:text-red-600 
                          text-gray-400 transition-all duration-200 absolute top-4 right-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Card
          className="relative z-0 mx-5 px-4 py-2 h-[25rem] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2
         border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200"
        >
          <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
            <div className="max-w-[65%]">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                {t("common.createFlashCard", "Create Flashcards")}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(
                  "common.createFlashCardDescription",
                  "Create a flashcard set with custom settings and personalization"
                )}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                className="rounded-2xl  px-6 py-3 font-medium shadow-sm transition-all duration-200"
                onClick={onCreateNew}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                {t("common.generate", "Generate")}
              </Button>
            </div>
          </div>

          <div
            className="pointer-events-none select-none absolute -left-20 bottom-0 z-0 opacity-90"
            aria-hidden
          >
            <img
              src={flashcards}
              alt="Flashcards"
              className="block h-auto w-[22rem] md:w-[26rem] lg:w-[30rem] translate-x-[20px] translate-y-1/4"
            />
          </div>
        </Card>
      </motion.div>

      <Dialog open={deleteModal.isOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              {t("common.confirmDelete", "Confirm Delete")}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {t(
                "common.deleteWarning",
                "Are you sure you want to delete this flashcard set? This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>

          {deleteModal.setToDelete && (
            <div className="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <p className="font-medium text-gray-900">
                {deleteModal.setToDelete.title}
              </p>
              {deleteModal.setToDelete.categories && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {deleteModal.setToDelete.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="rounded-xl"
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common.delete", "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
                <span className="text-sm">Back</span>
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
  handleStudyStart,
  reviewedCount,
}: {
  totalCards: number;
  activeSet: any;
  handleCardUpdate: any;
  reviewedCount: number;
  handleStudyStart: any;
}) {
  return (
    <>
      <div className="flex flex-col items-center">
        <ProgressIndicator
          reviewed={reviewedCount}
          total={totalCards}
          onStartStudy={handleStudyStart}
        />
      </div>

      <div className="space-y-2 px-16 sm:px-0 flex-col flex justify-center align-baseline">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[18px] text-zinc-900 font-medium">
            Flashcards <span className="text-sm">({totalCards})</span>
          </h2>
        </div>

        {activeSet.flashcards.map((flashcard, idx) => (
          <Card key={flashcard.id || idx} className="shadow-sm">
            <div className="mx-5 space-y-4 py-2">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-opacity-75 text-zinc-800 flex items-center gap-2">
                    <span>Card {idx + 1} </span>
                    <Badge variant={"outline"} className="rounded-2xl">
                      {flashcard.category}
                    </Badge>
                  </span>
                </div>
                <div className="py-2 px-2 cursor-pointer hover:bg-red-200/50 rounded-xl group">
                  <Trash2 className="w-4 h-4 group-hover:text-red-600" />
                </div>
              </div>

              <FlashcardEditForm
                flashcard={flashcard}
                onUpdate={(updates) => handleCardUpdate(idx, updates)}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
