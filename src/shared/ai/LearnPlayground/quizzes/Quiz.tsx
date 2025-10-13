import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  createNewQuizApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizView } from "./QuizView";
import { QuizListProps, Quiz, QuizType, QuizAttemptSummary } from "./types";

export const QuizList: React.FC<QuizListProps> = ({ workspaceId }) => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<QuizType[]>([]);

  const [quizOptions, ,] = useState<{
    numberOfQuestions: number;
    difficulty: string;
  }>({
    numberOfQuestions: 5,
    difficulty: "medium",
  });

  const fetchWorkspaceContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkSpaceContent(workspaceId);
      setQuizzes(data?.quizzes || []);
    } catch (error) {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  // Fetch quizzes
  useEffect(() => {
    fetchWorkspaceContent();
  }, [fetchWorkspaceContent]);

  // Called when modal saves new quiz options
  const handleCreateQuiz = async (options: {
    questionTypes: QuizType[];
    numberOfQuestions: number;
    difficulty: string;
  }) => {
    setIsModalOpen(false);
    await createNewQuizApi({
      id: workspaceId,
      questionTypes: options.questionTypes,
      numberOfQuestions: options.numberOfQuestions,
      difficulty: options.difficulty,
    });
    await fetchWorkspaceContent();
    setSelectedTypes([]);
  };

  const handleAttemptUpdate = useCallback(
    (quizId: string, attempt: QuizAttemptSummary | null) => {
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === quizId ? { ...quiz, latestAttempt: attempt } : quiz
        )
      );
      setSelectedQuiz((prev) =>
        prev && prev.id === quizId ? { ...prev, latestAttempt: attempt } : prev
      );
    },
    []
  );

  if (selectedQuiz) {
    return (
      <QuizView
        quiz={selectedQuiz}
        workspaceId={workspaceId}
        onClose={async () => {
          setSelectedQuiz(null);
          await fetchWorkspaceContent();
        }}
        onAttemptUpdate={(attempt) =>
          handleAttemptUpdate(selectedQuiz.id, attempt)
        }
      />
    );
  }

  return (
    <>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="px-6 mb-4 flex flex-col rounded-3xl justify-between space-y-3"
          >
            <h3 className="px-2 text-sm font-medium text-gray-700">
              My Quizzes
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4 h-32 animate-pulse">
                    <Skeleton className="h-6 w-40 mb-3" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </Card>
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <p className="text-gray-500">No quizzes available.</p>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const attempt = quiz.latestAttempt ?? null;
                  const rawProgress = attempt
                    ? Number(
                        attempt.progressPct ??
                          (attempt.totalCount
                            ? (attempt.answeredCount / attempt.totalCount) * 100
                            : 0)
                      )
                    : 0;
                  const progress = Number.isFinite(rawProgress)
                    ? Math.min(100, Math.max(0, rawProgress))
                    : 0;
                  const scoreEarned = attempt?.scoreEarned ?? 0;
                  const totalPoints = attempt?.scoreTotal ?? 0;
                  const infoLine = attempt
                    ? attempt.status === "graded"
                      ? `${scoreEarned}/${totalPoints} pts${
                          attempt.passed === true
                            ? " • Passed"
                            : attempt.passed === false
                            ? " • Failed"
                            : ""
                        }`
                      : `${attempt.answeredCount}/${attempt.totalCount} answered`
                    : "No attempt yet";
                  const statusLabel = (() => {
                    if (!attempt) return "Not started";
                    if (attempt.status === "graded") {
                      if (attempt.passed === true) return "Passed";
                      if (attempt.passed === false) return "Failed";
                      return "Graded";
                    }
                    return attempt.status.replace(/_/g, " ");
                  })();
                  const statusVariant = !attempt
                    ? "outline"
                    : attempt.status === "graded"
                    ? attempt.passed === false
                      ? "destructive"
                      : "default"
                    : "outline";
                  return (
                    <Card
                      key={quiz.id}
                      onClick={() => setSelectedQuiz(quiz)}
                      className="group relative px-6 py-5 flex flex-col rounded-2xl justify-center hover:bg-gradient-to-r hover:from-gray-50 ease-in
                       hover:to-gray-100/80 cursor-transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1 flex items-center justify-between">
                          <h3 className="font-medium text-lg text-gray-900">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant={statusVariant}
                                className="text-xs capitalize"
                              >
                                {statusLabel}
                              </Badge>
                              <p className="text-sm text-gray-500">
                                {quiz.questions.length} Questions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            Progress
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">{infoLine}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>

          <Card className="relative z-0 mx-5 px-4 py-2  flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
            <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
              <div className="max-w-[65%]">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                  Create Quiz
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create quiz sets with preferred question types, difficulty,
                  and more.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </div>
          </Card>
        </ScrollArea>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Quiz Options</DialogTitle>
            <DialogDescription>Set options for the new quiz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() =>
                handleCreateQuiz({
                  questionTypes: selectedTypes,
                  numberOfQuestions: quizOptions.numberOfQuestions,
                  difficulty: quizOptions.difficulty,
                })
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
