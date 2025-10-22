import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizView } from "./QuizView";
import { Quiz, QuizAttemptSummary } from "./types";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import { GenerationStatus } from "../types";
import QuizModal from "./QuizModal";

export const QuizList: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    fetchWorkspaceContent();
  }, [fetchWorkspaceContent, refresh]);

  const anyActive = useMemo(
    () =>
      quizzes.some((x) => x.status === "pending" || x.status === "processing"),
    [quizzes]
  );

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
              <></>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const attempt = quiz.latestAttempt ?? null;
                  const disabled =
                    quiz.status === GenerationStatus.PENDING ||
                    quiz.status === GenerationStatus.PROCESSING;
                  const failed = quiz.status === GenerationStatus.FAILED;
                  const percent = attempt?.scoreTotal
                    ? (attempt.scoreEarned * 100) / attempt.scoreTotal
                    : 0;
                  const rawProgress = attempt ? Number(percent) : 0;
                  const progress = Number.isFinite(rawProgress)
                    ? Math.min(100, Math.max(0, rawProgress))
                    : 0;

                  const scoreEarned = attempt?.scoreEarned ?? 0;
                  const totalPointsFromAttempt = attempt?.scoreTotal ?? 0;
                  const infoLine = attempt
                    ? attempt.status === "graded"
                      ? `${scoreEarned}/${totalPointsFromAttempt} pts${
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

                  const questionCount =
                    quiz.payload?.questions.length ?? quiz.questionCount ?? 0;

                  return (
                    <Card
                      key={quiz.id}
                      role="button"
                      aria-disabled={disabled}
                      aria-busy={disabled}
                      onClick={() =>
                        !disabled && !failed && setSelectedQuiz(quiz)
                      }
                      className={`group relative overflow-hidden px-6 py-5 flex flex-col rounded-2xl justify-center transition-all duration-200 cursor-pointer
                        ${
                          failed
                            ? "bg-red-50/50 border-red-200 hover:border-red-300"
                            : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 border-gray-200/60 hover:border-gray-300/80"
                        } ${disabled ? "pointer-events-auto" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg text-gray-900 truncate">
                              {quiz.payload?.title ?? "Generating quiz..."}
                            </h3>
                            <StatusBadge status={quiz.status} />
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={statusVariant}
                              className="text-xs capitalize"
                            >
                              {statusLabel}
                            </Badge>
                            <p className="text-sm text-gray-500">
                              {questionCount} Questions
                            </p>
                          </div>
                        </div>
                      </div>

                      {failed && (
                        <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>
                            {quiz.failureReason ||
                              "Generation failed. You can regenerate or delete this quiz."}
                          </span>
                        </div>
                      )}

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
                      {quiz.status === GenerationStatus.PROCESSING && (
                        <ProgressStrip />
                      )}
                      {quiz.status === GenerationStatus.PENDING && (
                        <QueuedStrip />
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>

          <QuizModal
            workspaceId={workspaceId}
            anyActive={anyActive}
            setRefresh={() => setRefresh(!refresh)}
          />
        </ScrollArea>
      </div>
    </>
  );
};
