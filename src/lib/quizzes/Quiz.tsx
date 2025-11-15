import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
import { normalizeQuiz } from "./utils";
import { useTranslation } from "react-i18next";
import useGenerationNotifications from "@/hooks/useGenerationNotifications";

const POLL_INTERVAL_MS = 3500;

export const QuizList: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction == "rtl";
  const isMountedRef = useRef(true);

  const fetchWorkspaceContent = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setLoading(true);
      try {
        const data = await getWorkSpaceContent(workspaceId);

        const formattedQuizzes = (
          Array.isArray(data?.quizzes) ? data?.quizzes : []
        ).map((quiz: any) => normalizeQuiz(quiz));

        if (!isMountedRef.current) return;
        setQuizzes(formattedQuizzes);
        setError(null);
      } catch (error) {
        if (!isMountedRef.current) return;
        console.error("Failed to fetch workspace content:", error);
        setQuizzes([]);
        setError("quizzes.fetchError");
      } finally {
        if (!isMountedRef.current) return;
        if (!silent) setLoading(false);
      }
    },
    [workspaceId]
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchWorkspaceContent();
  }, [fetchWorkspaceContent, refresh]);

  const anyActive = useMemo(
    () =>
      quizzes.some((x) => x.status === "pending" || x.status === "processing"),
    [quizzes]
  );

  useGenerationNotifications(quizzes, {
    entity: "quiz",
    getName: (quiz) => quiz.title,
  });

  useEffect(() => {
    if (!anyActive) return;
    const interval = window.setInterval(
      () => fetchWorkspaceContent({ silent: true }),
      POLL_INTERVAL_MS
    );
    return () => window.clearInterval(interval);
  }, [anyActive, fetchWorkspaceContent]);

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
    <div className="flex-1 min-h-0 w-full">
      <ScrollArea className="h-full w-full">
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-full mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4"
          dir={direction}
        >
          <div className="px-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white">
              {t("quizzes.list.title", "My Quizzes")}
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-3 sm:p-4 h-28 sm:h-32 animate-pulse overflow-hidden"
                >
                  <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-2 sm:mb-3" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive px-2">
              {t(error, "Failed to fetch quizzes. Please try again.")}
            </div>
          ) : quizzes.length === 0 ? (
            <></>
          ) : (
            <ul className="space-y-3 sm:space-y-4 list-none m-0 p-0 w-full">
              {quizzes.map((quiz) => {
                const attempt = quiz.latestAttempt ?? null;
                const disabled =
                  quiz.status === GenerationStatus.PENDING ||
                  quiz.status === GenerationStatus.PROCESSING;
                const failed = quiz.status === GenerationStatus.FAILED;
                const percent = attempt?.scoreTotal
                  ? (attempt.scoreEarned * 100) / attempt.scoreTotal
                  : 0;
                const progress = Math.min(
                  100,
                  Math.max(0, Number.isFinite(percent) ? percent : 0)
                );

                const scoreSuffix =
                  attempt?.status === "graded"
                    ? attempt.passed === true
                      ? t("quizzes.list.scoreSuffix.passed", " • Passed")
                      : attempt.passed === false
                      ? t("quizzes.list.scoreSuffix.failed", " • Failed")
                      : ""
                    : "";

                const infoLine = attempt
                  ? attempt.status === "graded"
                    ? t("quizzes.list.scoreLine", {
                        earned: attempt.scoreEarned,
                        total: attempt.scoreTotal,
                        statusSuffix: scoreSuffix,
                      })
                    : t("quizzes.list.answeredLine", {
                        answered: attempt.answeredCount,
                        total: attempt.totalCount,
                      })
                  : t("quizzes.list.noAttempt", "No attempt yet");

                const statusLabel = (() => {
                  if (!attempt)
                    return t("quizzes.list.status.notStarted", "Not started");
                  if (attempt.status === "graded") {
                    if (attempt.passed === true)
                      return t("quizzes.list.status.passed", "Passed");
                    if (attempt.passed === false)
                      return t("quizzes.list.status.failed", "Failed");
                    return t("quizzes.list.status.graded", "Graded");
                  }
                  const key = attempt.status.replace(/-/g, "_");
                  const fallback = attempt.status.replace(/_/g, " ");
                  return t(`quizzes.list.status.${key}`, fallback);
                })();

                const statusVariant = !attempt
                  ? "outline"
                  : attempt.status === "graded"
                  ? attempt.passed === false
                    ? "destructive"
                    : "default"
                  : "outline";

                const questionCount =
                  quiz.questionCount ?? quiz.payload?.questions?.length ?? 0;

                return (
                  <li key={quiz.id} className="w-full">
                    <Card
                      role="button"
                      aria-disabled={disabled}
                      onClick={() =>
                        !disabled && !failed && setSelectedQuiz(quiz)
                      }
                      className={`group relative overflow-hidden w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col rounded-xl sm:rounded-2xl justify-center transition-all duration-200 cursor-pointer ${
                        failed
                          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800"
                          : "border-gray-200/60 dark:border-zinc-800 hover:border-gray-300/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40"
                      } ${disabled ? "pointer-events-auto" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2 sm:gap-3 min-w-0 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 min-w-0 flex-wrap">
                            <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white min-w-0 break-words flex-1">
                              {quiz.title ||
                                t(
                                  "quizzes.list.generating",
                                  "Generating quiz..."
                                )}
                            </h3>
                            <div className="flex-shrink-0">
                              <StatusBadge status={quiz.status} isRTL={isRTL} />
                            </div>
                          </div>
                          {quiz.status == GenerationStatus.COMPLETED && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={statusVariant}
                                className="text-xs capitalize flex-shrink-0"
                              >
                                {statusLabel}
                              </Badge>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {t("quizzes.list.questions", {
                                  count: questionCount,
                                  defaultValue: "{{count}} Questions",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {failed && (
                        <div className="mt-3 w-full rounded-lg sm:rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-3 py-2 text-xs sm:text-sm flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="break-words">
                            {t(
                              "quizzes.list.failure",
                              "Generation failed. You can regenerate or delete this quiz."
                            )}
                          </span>
                        </div>
                      )}

                      {quiz.status === GenerationStatus.COMPLETED && (
                        <div className="mt-3 w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t("quizzes.list.progress", "Progress")}
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-full">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 break-words">
                            {infoLine}
                          </p>
                        </div>
                      )}

                      {quiz.status === GenerationStatus.PROCESSING && (
                        <div className="w-full">
                          <ProgressStrip />
                        </div>
                      )}
                      {quiz.status === GenerationStatus.PENDING && (
                        <div className="w-full">
                          <QueuedStrip />
                        </div>
                      )}
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>

        <QuizModal
          workspaceId={workspaceId}
          anyActive={anyActive}
          setRefresh={() => setRefresh(!refresh)}
        />
      </ScrollArea>
    </div>
  );
};
