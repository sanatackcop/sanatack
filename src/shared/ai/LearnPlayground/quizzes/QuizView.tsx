import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, ChevronLeft, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  answerWorkspaceQuizQuestion,
  startWorkspaceQuizAttempt,
  submitWorkspaceQuizAttempt,
} from "@/utils/_apis/learnPlayground-api";
import { AnswerEntry, Question, Quiz, QuizAttemptSummary } from "./types";

interface QuizViewProps {
  quiz: Quiz;
  workspaceId: string;
  onClose: () => void;
  onAttemptUpdate?: (attempt: QuizAttemptSummary | null) => void;
}

const deriveNextIndex = (
  attempt: QuizAttemptSummary | null,
  totalQuestions: number
) => {
  if (!attempt || totalQuestions === 0) return 0;
  if (attempt.status === "graded") return Math.max(totalQuestions - 1, 0);

  const candidate =
    typeof attempt.lastQuestionPos === "number" && attempt.lastQuestionPos > 0
      ? attempt.lastQuestionPos
      : attempt.answeredCount;

  if (!Number.isFinite(candidate)) return 0;
  if (candidate >= totalQuestions) return Math.max(totalQuestions - 1, 0);
  return candidate;
};

const normaliseStatusLabel = (attempt: QuizAttemptSummary | null) => {
  if (!attempt) return "Not started";
  if (attempt.status === "graded") {
    if (attempt.passed === true) return "Passed";
    if (attempt.passed === false) return "Failed";
    return "Graded";
  }
  return attempt.status.replace(/_/g, " ");
};

export const QuizView: React.FC<QuizViewProps> = ({
  quiz,
  workspaceId,
  onClose,
  onAttemptUpdate,
}) => {
  const [quizData, setQuizData] = useState<Quiz>(quiz);
  const [attempt, setAttempt] = useState<QuizAttemptSummary | null>(
    quiz.latestAttempt ?? null
  );
  const [currentIndex, setCurrentIndex] = useState(() =>
    deriveNextIndex(quiz.latestAttempt ?? null, quiz.questions.length)
  );
  const [showResults, setShowResults] = useState(
    quiz.latestAttempt?.status === "graded"
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingAttempt, setLoadingAttempt] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const initialAttempt = quiz.latestAttempt ?? null;
    const nextIndex = deriveNextIndex(initialAttempt, quiz.questions.length);
    setQuizData(quiz);
    setAttempt(initialAttempt);
    setShowResults(initialAttempt?.status === "graded");
    setCurrentIndex(nextIndex);
    setShowFeedback(
      !!(
        initialAttempt &&
        quiz.questions[nextIndex] &&
        initialAttempt.answers?.some(
          (entry) => entry.question_id === quiz.questions[nextIndex].id
        )
      )
    );
  }, [quiz]);

  const answersMap = useMemo(() => {
    const map: Record<string, AnswerEntry> = {};
    attempt?.answers?.forEach((entry) => {
      if (entry?.question_id) map[entry.question_id] = entry;
    });
    return map;
  }, [attempt]);

  const applyAttemptToState = useCallback(
    (att: QuizAttemptSummary | null, serverQuiz?: Quiz) => {
      setAttempt(att);
      setQuizData((prev) => {
        const baseQuiz = serverQuiz ?? prev;
        const mergedQuiz: Quiz = {
          ...baseQuiz,
          latestAttempt: att ?? baseQuiz.latestAttempt ?? null,
        };
        const questions = mergedQuiz.questions ?? [];
        const nextIndex = deriveNextIndex(att, questions.length);
        setCurrentIndex(nextIndex);
        const nextQuestionId = questions[nextIndex]?.id;
        const hasAnsweredCurrent =
          !!att &&
          !!att.answers?.some((entry) => entry.question_id === nextQuestionId);
        setShowFeedback(hasAnsweredCurrent);
        return mergedQuiz;
      });
      setShowResults(att?.status === "graded");
      onAttemptUpdate?.(att ?? null);
    },
    [onAttemptUpdate]
  );

  const fetchAttempt = useCallback(
    async (payload?: { restart?: boolean }) => {
      setLoadingAttempt(true);
      try {
        const data = await startWorkspaceQuizAttempt(
          workspaceId,
          quiz.id,
          payload
        );
        const att = (data?.attempt ?? null) as QuizAttemptSummary | null;
        const serverQuiz = data?.quiz as Quiz | undefined;
        applyAttemptToState(att, serverQuiz);
        setError(null);
        return att;
      } catch (e: any) {
        setError(e?.error?.body || "Failed to load quiz attempt.");
        return null;
      } finally {
        setLoadingAttempt(false);
        setInitialised(true);
      }
    },
    [workspaceId, quiz.id, applyAttemptToState]
  );

  useEffect(() => {
    fetchAttempt();
  }, [fetchAttempt]);

  const ensureAttempt = useCallback(async () => {
    if (attempt?.id) return attempt;
    return await fetchAttempt();
  }, [attempt, fetchAttempt]);

  const questions = quizData.questions ?? [];
  const totalQuestions = questions.length;
  const currentQuestion: Question | undefined = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answersMap[currentQuestion.id]
    : undefined;

  useEffect(() => {
    if (!currentQuestion) {
      setShowFeedback(false);
      return;
    }
    setShowFeedback(Boolean(currentAnswer));
  }, [currentQuestion, currentAnswer]);

  const answeredCount = attempt?.answeredCount ?? 0;
  const attemptProgress = totalQuestions
    ? Math.min(100, Math.max(0, (answeredCount / totalQuestions) * 100))
    : 0;
  const statusLabel = normaliseStatusLabel(attempt);
  const scoreEarned = attempt?.scoreEarned ?? 0;
  const totalPoints =
    attempt?.scoreTotal ?? questions.reduce((acc, q) => acc + q.points, 0);
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  const handleSelectAnswer = async (
    questionId: string,
    option: string | null
  ) => {
    if (savingAnswer || showResults) return;
    const activeAttempt = await ensureAttempt();
    if (!activeAttempt) {
      setError("Unable to start quiz attempt. Please try again.");
      return;
    }
    setSavingAnswer(true);
    setError(null);
    try {
      const response = await answerWorkspaceQuizQuestion(activeAttempt.id, {
        questionId,
        selectedOption: option,
      });
      const updated = response?.attempt as QuizAttemptSummary;
      applyAttemptToState(updated);
      setShowFeedback(true);
    } catch (e: any) {
      setError(e?.error?.body || "Unable to save answer.");
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleDontKnow = () => {
    if (!currentQuestion) return;
    handleSelectAnswer(currentQuestion.id, null);
  };

  const handleNext = async () => {
    const activeAttempt = await ensureAttempt();
    if (!activeAttempt) {
      setError("Unable to start quiz attempt. Please try again.");
      return;
    }

    if (showResults) {
      onClose();
      return;
    }

    if (!isLastQuestion) {
      const nextIndex = Math.min(currentIndex + 1, totalQuestions - 1);
      setCurrentIndex(nextIndex);
      const nextQuestionId = questions[nextIndex]?.id;
      setShowFeedback(Boolean(nextQuestionId && answersMap[nextQuestionId]));
      return;
    }

    if (activeAttempt.status === "graded") {
      setShowResults(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await submitWorkspaceQuizAttempt(activeAttempt.id);
      const updated = response?.attempt as QuizAttemptSummary;
      applyAttemptToState(updated);
      setShowResults(true);
      setCurrentIndex(Math.max(totalQuestions - 1, 0));
      setShowFeedback(false);
    } catch (e: any) {
      setError(e?.error?.body || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = async () => {
    setShowResults(false);
    setShowFeedback(false);
    setCurrentIndex(0);
    await fetchAttempt({ restart: true });
  };

  const renderOptions = (question: Question) => {
    const isAnswered = !!currentAnswer;

    if (question.type === "multiple_choice" || question.type === "scenario") {
      return question.options.map((opt, idx) => {
        const isSelected = currentAnswer?.selected_option === opt;
        const isCorrect = opt === question.correct_answer;
        const showCorrectness = showFeedback && isAnswered;

        let optClass =
          "cursor-pointer rounded-xl border-2 px-5 py-4 mb-3 inline-block w-full text-left transition-all duration-200 text-base ";
        if (showCorrectness) {
          if (isCorrect) {
            optClass +=
              "bg-green-50 border-green-400 text-green-900 font-medium";
          } else if (isSelected && !isCorrect) {
            optClass += "bg-red-50 border-red-400 text-red-900 font-medium";
          } else {
            optClass += "bg-white border-gray-200 text-gray-600";
          }
        } else if (isSelected) {
          optClass += "bg-blue-50 border-blue-400 font-medium";
        } else {
          optClass +=
            "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";
        }

        return (
          <button
            key={idx}
            onClick={() => handleSelectAnswer(question.id, opt)}
            // disabled={savingAnswer || loadingAttempt || showResults} // Temporarily disabled for debugging click issue
            className={optClass}
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-500">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span>{opt}</span>
            </div>
          </button>
        );
      });
    }

    if (question.type === "true_false") {
      return ["True", "False"].map((val, idx) => {
        const isSelected = currentAnswer?.selected_option === val;
        const isCorrect = val === question.correct_answer;
        const showCorrectness = showFeedback && isAnswered;

        let btnClass =
          "cursor-pointer rounded-xl border-2 px-8 py-4 mr-4 text-center min-w-[120px] transition-all duration-200 text-base ";
        if (showCorrectness) {
          if (isCorrect) {
            btnClass +=
              "bg-green-50 border-green-400 text-green-900 font-medium";
          } else if (isSelected && !isCorrect) {
            btnClass += "bg-red-50 border-red-400 text-red-900 font-medium";
          } else {
            btnClass += "bg-white border-gray-200 text-gray-600";
          }
        } else if (isSelected) {
          btnClass += "bg-blue-50 border-blue-400 font-medium";
        } else {
          btnClass +=
            "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";
        }

        return (
          <button
            key={idx}
            onClick={() => handleSelectAnswer(question.id, val)}
            // disabled={savingAnswer || loadingAttempt || showResults} // Temporarily disabled for debugging click issue
            className={btnClass}
            type="button"
          >
            <div className="flex items-center gap-2 justify-center">
              <span className="font-semibold text-gray-500">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span>{val}</span>
            </div>
          </button>
        );
      });
    }

    return null;
  };

  const accuracyPct = totalPoints
    ? Math.round((scoreEarned / totalPoints) * 100)
    : 0;
  const passingScore = quizData.passing_score ?? null;
  const hasPassed =
    passingScore !== null
      ? scoreEarned >= passingScore
      : attempt?.passed ?? null;
  const gradeClass =
    hasPassed === null
      ? "text-gray-600"
      : hasPassed
      ? "text-green-600"
      : "text-red-600";

  const continueDisabled =
    loadingAttempt ||
    submitting ||
    savingAnswer ||
    (!showResults && (!showFeedback || !currentAnswer));

  const isLoadingInitial = !initialised && loadingAttempt;

  return (
    <ScrollArea>
      <div className="min-h-screen py-6">
        {isLoadingInitial ? (
          <div className="max-w-4xl mx-auto px-6 py-16">
            <Card className="p-8 text-center bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Preparing quiz...</p>
            </Card>
          </div>
        ) : !showResults ? (
          <>
            <div className="max-w-4xl mx-auto px-6 mb-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
                  </button>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="capitalize">{statusLabel}</span>
                    <span className="text-gray-300">•</span>
                    <span>
                      {Math.min(currentIndex + 1, totalQuestions)} /{" "}
                      {totalQuestions}
                    </span>
                  </div>
                </div>

                <div className="h-2 bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${attemptProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="px-6 py-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>Progress: {Math.round(attemptProgress)}%</span>
                  <span>
                    Answered: {answeredCount}/{totalQuestions}
                  </span>
                  <span>
                    Score: {scoreEarned}/{totalPoints} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                key={currentQuestion?.id ?? currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <Card className="p-4 mb-4 border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                  </Card>
                )}

                <Card className="p-8 mb-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                  {loadingAttempt && !currentQuestion ? (
                    <p className="text-sm text-gray-500">Loading quiz…</p>
                  ) : currentQuestion ? (
                    <>
                      <p className="text-xl font-medium text-gray-900 leading-relaxed mb-8">
                        {currentQuestion.question}
                      </p>
                      <div>{renderOptions(currentQuestion)}</div>

                      {showFeedback && currentAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-6 p-5 rounded-xl border-2 ${
                            currentAnswer.is_correct
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {currentAnswer.is_correct ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                  <Check className="h-5 w-5 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    ✗
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-semibold mb-2 text-base ${
                                  currentAnswer.is_correct
                                    ? "text-green-900"
                                    : "text-red-900"
                                }`}
                              >
                                {currentAnswer.is_correct
                                  ? "Correct!"
                                  : "Incorrect"}
                              </h4>
                              {!currentAnswer.is_correct && (
                                <p className="text-sm text-red-800 mb-2">
                                  The correct answer is:{" "}
                                  <span className="font-semibold">
                                    {currentQuestion.correct_answer}
                                  </span>
                                </p>
                              )}
                              {currentQuestion.explanation && (
                                <p className="text-sm text-gray-700 mt-2">
                                  <span className="font-medium">
                                    Explanation:
                                  </span>{" "}
                                  {currentQuestion.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No question available.
                    </p>
                  )}
                </Card>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <button
                      onClick={handleDontKnow}
                      disabled={
                        !currentQuestion ||
                        showResults ||
                        loadingAttempt ||
                        savingAnswer
                      }
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Don't know
                    </button>

                    <button
                      onClick={restartQuiz}
                      className="p-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={loadingAttempt || savingAnswer || submitting}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={continueDisabled}
                    className="px-8 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isLastQuestion ? (
                      <>
                        <Check className="h-5 w-5" />
                        {submitting
                          ? "Submitting..."
                          : showResults
                          ? "Close"
                          : "Submit quiz"}
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-16">
            <Card className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Quiz Complete!
                </h3>
                <p className="text-gray-600">Thanks for taking the quiz.</p>
              </div>

              <div className="my-8 p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-sm mb-2">Your Score</p>
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  {scoreEarned}
                  <span className="text-2xl text-gray-400">/{totalPoints}</span>
                </p>
                <p className="text-sm text-gray-500">{accuracyPct}% Correct</p>
              </div>

              {passingScore !== null && (
                <p className={`text-lg font-semibold mb-6 ${gradeClass}`}>
                  {hasPassed ? "✓ Passed" : "✗ Failed"}
                  <span className="text-gray-500 font-normal">
                    {" "}
                    (Passing Score: {passingScore})
                  </span>
                </p>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={restartQuiz}
                  variant="outline"
                  className="rounded-xl px-6 py-3 border-2"
                  disabled={loadingAttempt}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button onClick={onClose} className="rounded-xl px-6 py-3">
                  Back to Quizzes
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
