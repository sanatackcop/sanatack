import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
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

// Loading Component
const LoadingCard: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <Card className="p-8 text-center bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </Card>
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Card className="p-4 mb-4 border border-red-200 bg-red-50 text-red-700 text-sm">
    {message}
  </Card>
);

const ProgressBar: React.FC<{
  statusLabel: string;
  currentIndex: number;
  totalQuestions: number;
  attemptProgress: number;
  answeredCount: number;
  scoreEarned: number;
  totalPoints: number;
}> = ({
  statusLabel,
  currentIndex,
  totalQuestions,
  attemptProgress,
  answeredCount,
  scoreEarned,
  totalPoints,
}) => (
  <div className="max-w-4xl mx-auto px-6 mb-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="capitalize">{statusLabel}</span>
          <span className="text-gray-300">•</span>
          <span>
            {Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}
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
);

// Feedback Component
const FeedbackPanel: React.FC<{
  answer: AnswerEntry;
  correctAnswer: string;
  explanation?: string;
}> = ({ answer, correctAnswer, explanation }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`mt-6 p-5 rounded-xl border-2 ${
      answer.is_correct
        ? "bg-green-50 border-green-300"
        : "bg-red-50 border-red-300"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        {answer.is_correct ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">✗</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4
          className={`font-semibold mb-2 text-base ${
            answer.is_correct ? "text-green-900" : "text-red-900"
          }`}
        >
          {answer.is_correct ? "Correct!" : "Incorrect"}
        </h4>
        {!answer.is_correct && (
          <p className="text-sm text-red-800 mb-2">
            The correct answer is:{" "}
            <span className="font-semibold">{correctAnswer}</span>
          </p>
        )}
        {explanation && (
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-medium">Explanation:</span> {explanation}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

// Results Component
const ResultsView: React.FC<{
  scoreEarned: number;
  totalPoints: number;
  accuracyPct: number;
  passingScore: number | null;
  hasPassed: boolean | null;
  onRestart: () => void;
  onClose: () => void;
  isLoading: boolean;
}> = ({
  scoreEarned,
  totalPoints,
  accuracyPct,
  passingScore,
  hasPassed,
  onRestart,
  onClose,
  isLoading,
}) => {
  const gradeClass =
    hasPassed === null
      ? "text-gray-600"
      : hasPassed
      ? "text-green-600"
      : "text-red-600";

  return (
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
            onClick={onRestart}
            variant="outline"
            className="rounded-xl px-6 py-3 border-2"
            disabled={isLoading}
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
  );
};

const deriveNextIndex = (
  attempt: QuizAttemptSummary | null,
  questions: Question[]
) => {
  const totalQuestions = questions.length;
  if (!attempt || totalQuestions === 0) return 0;
  if (attempt.status === "graded") return Math.max(totalQuestions - 1, 0);

  if (attempt.lastQuestionId) {
    const lastQuestionIdx = questions.findIndex(
      (q) => q.id === attempt.lastQuestionId
    );
    if (lastQuestionIdx >= 0) {
      return Math.min(lastQuestionIdx + 1, totalQuestions - 1);
    }
  }

  const hasLastPos =
    typeof attempt.lastQuestionPos === "number" && attempt.lastQuestionPos > 0;
  const candidate = hasLastPos
    ? attempt.lastQuestionPos
    : typeof attempt.answeredCount === "number"
    ? attempt.answeredCount
    : 0;

  if (!Number.isFinite(candidate)) return 0;
  const normalised = Math.max(0, Math.floor(candidate));
  if (normalised >= totalQuestions) return Math.max(totalQuestions - 1, 0);
  return normalised;
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
  if (!quiz || !quiz.payload)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="p-8 text-center bg-yellow-50 border border-yellow-200 shadow-sm">
          <p className="text-sm text-yellow-700">No Quiz Payload</p>
        </Card>
      </div>
    );

  const [quizData, setQuizData] = useState<Quiz>(quiz);
  const [attempt, setAttempt] = useState<QuizAttemptSummary | null>(
    quiz.latestAttempt ?? null
  );
  const [currentIndex, setCurrentIndex] = useState(() =>
    deriveNextIndex(quiz.latestAttempt ?? null, quiz.payload?.questions ?? [])
  );
  const [showResults, setShowResults] = useState(
    quiz.latestAttempt?.status === "graded"
  );
  const [loadingAttempt, setLoadingAttempt] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);

  const answersMap = useMemo(() => {
    const map: Record<string, AnswerEntry> = {};
    attempt?.answers?.forEach((entry) => {
      if (entry?.question_id) map[entry.question_id] = entry;
    });
    return map;
  }, [attempt]);

  const applyAttemptToState = (
    att: QuizAttemptSummary | null,
    serverQuiz?: Quiz
  ) => {
    setAttempt(att);
    setQuizData((prev) => {
      const incoming = serverQuiz ?? prev;
      const mergedPayload = {
        ...(prev.payload ?? {}),
        ...(incoming.payload ?? {}),
      };

      if (
        !Array.isArray(mergedPayload.questions) ||
        mergedPayload.questions.length === 0
      ) {
        mergedPayload.questions = prev.payload?.questions ?? [];
      }

      return {
        ...prev,
        ...incoming, // overlay server updates
        payload: mergedPayload, // merged payload with preserved questions
        latestAttempt:
          att ?? incoming.latestAttempt ?? prev.latestAttempt ?? null,
      } as Quiz;
    });
    setShowResults(att?.status === "graded");
    onAttemptUpdate?.(att ?? null);
  };

  const fetchAttempt = useCallback(
    async (payload?: { restart?: boolean }) => {
      setLoadingAttempt(true);
      setError(null);
      try {
        const data = await startWorkspaceQuizAttempt(
          workspaceId,
          quiz.id,
          payload
        );
        const att = (data?.attempt ?? null) as QuizAttemptSummary | null;
        const serverQuiz = data?.quiz as Quiz | undefined;
        applyAttemptToState(att, serverQuiz);

        const questions = (serverQuiz?.payload?.questions ??
          quiz.payload?.questions ??
          []) as Question[];
        const nextIndex = deriveNextIndex(att, questions);
        setCurrentIndex(nextIndex);

        return att;
      } catch (e: any) {
        setError(e?.error?.body || "Failed to load quiz attempt.");
        return null;
      } finally {
        setLoadingAttempt(false);
        setInitialised(true);
      }
    },
    [workspaceId, quiz.id]
  );

  useEffect(() => {
    if (!initialised) {
      fetchAttempt();
    }
  }, [initialised, fetchAttempt]);

  useEffect(() => {
    setQuizData(quiz);
    setAttempt(quiz.latestAttempt ?? null);
    setCurrentIndex(
      deriveNextIndex(quiz.latestAttempt ?? null, quiz.payload?.questions ?? [])
    );
    setShowResults(quiz.latestAttempt?.status === "graded");
    setError(null);
    setSavingAnswer(false);
    setSubmitting(false);
    setInitialised(false);
  }, [quiz.id]);

  const ensureAttempt = useCallback(async () => {
    if (attempt?.id) return attempt;
    return await fetchAttempt();
  }, [attempt, fetchAttempt]);

  const questions = quizData.payload?.questions ?? [];
  const totalQuestions = questions.length;
  const currentQuestion: Question | undefined = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answersMap[currentQuestion.id]
    : undefined;

  const answeredCount =
    attempt?.answers?.length ??
    (typeof attempt?.answeredCount === "number" ? attempt.answeredCount : 0);

  const percent = attempt?.scoreTotal
    ? (attempt.scoreEarned * 100) / attempt.scoreTotal
    : 0;

  const attemptProgress = (() => {
    if (!totalQuestions) return 0;
    return Math.min(100, percent);
  })();
  const statusLabel = normaliseStatusLabel(attempt);
  const scoreEarnedValue =
    attempt && attempt.scoreEarned !== undefined
      ? Number(attempt.scoreEarned)
      : NaN;
  const scoreEarned = Number.isFinite(scoreEarnedValue) ? scoreEarnedValue : 0;

  const totalPointsValue =
    attempt && attempt.scoreTotal !== undefined
      ? Number(attempt.scoreTotal)
      : NaN;

  const fallbackTotalPoints = questions.reduce((acc, q) => {
    const pts = Number.isFinite(Number(q.points)) ? Number(q.points) : 0;
    return acc + pts;
  }, 0);

  const totalPoints = Number.isFinite(totalPointsValue)
    ? totalPointsValue
    : fallbackTotalPoints;

  const isLastQuestion = currentIndex >= totalQuestions - 1;

  const handleSelectAnswer = async (
    questionId: string,
    option: string | null
  ) => {
    if (answersMap[questionId]) return;
    if (savingAnswer || showResults || loadingAttempt) return;

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
    } catch (e: any) {
      setError(e?.error?.body || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };
  const [scenarioInput, setScenarioInput] = useState("");

  const restartQuiz = async () => {
    setShowResults(false);
    setCurrentIndex(0);
    await fetchAttempt({ restart: true });
  };

  const renderOptions = (question: Question) => {
    const hasAnswered = !!currentAnswer;
    const isDisabled =
      savingAnswer || loadingAttempt || showResults || hasAnswered;

    if (question.type === "scenario") {
      const handleScenarioSubmit = () => {
        if (!isDisabled && scenarioInput.trim()) {
          handleSelectAnswer(question.id, scenarioInput.trim());
        }
      };

      return (
        <div className="w-full mt-3">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Your answer:
          </label>
          <input
            type="text"
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleScenarioSubmit();
            }}
            disabled={isDisabled}
            placeholder="Type your answer here..."
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
          />
          <button
            onClick={handleScenarioSubmit}
            disabled={isDisabled || !scenarioInput.trim()}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      );
    }

    if (question.type === "multiple_choice") {
      return question.options.map((opt, idx) => {
        const isSelected = currentAnswer?.selected_option === opt;
        const isCorrect = opt === question.correct_answer;
        const showCorrectness = hasAnswered;

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

        if (isDisabled) {
          optClass += " opacity-60 cursor-not-allowed";
        }

        return (
          <button
            key={idx}
            onClick={() => !isDisabled && handleSelectAnswer(question.id, opt)}
            disabled={isDisabled}
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
        const showCorrectness = hasAnswered;

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

        if (isDisabled) {
          btnClass += " opacity-60 cursor-not-allowed";
        }

        return (
          <button
            key={idx}
            onClick={() => !isDisabled && handleSelectAnswer(question.id, val)}
            disabled={isDisabled}
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

  const accuracyPct =
    totalPoints > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((scoreEarned / totalPoints) * 100))
        )
      : 0;

  const passingScoreValue =
    quizData.payload?.passing_score === undefined ||
    quizData.payload?.passing_score === null
      ? null
      : Number(quizData.payload?.passing_score);

  const passingScore =
    passingScoreValue === null || Number.isNaN(passingScoreValue)
      ? null
      : passingScoreValue;

  const hasPassed =
    passingScore !== null
      ? accuracyPct >= passingScore
      : attempt?.passed ?? null;

  const continueDisabled =
    loadingAttempt ||
    submitting ||
    savingAnswer ||
    (!showResults && !currentAnswer);

  const isLoadingInitial = !initialised && loadingAttempt;

  return (
    <ScrollArea>
      <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0">
        <div
          className="flex group items-center text-gray-400/50 cursor-pointer hover:bg-gray-50/50 drop-shadow-sm hover:text-zinc-700 rounded-2xl py-2 px-3 transition-all ease-linear duration-100"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all ease-out duration-200" />
          <span className="text-sm">Back</span>
        </div>
      </div>

      <div className="min-h-screen py-6 pt-0">
        {isLoadingInitial ? (
          <LoadingCard message="Preparing quiz..." />
        ) : showResults ? (
          <ResultsView
            scoreEarned={scoreEarned}
            totalPoints={totalPoints}
            accuracyPct={accuracyPct}
            passingScore={passingScore}
            hasPassed={hasPassed}
            onRestart={restartQuiz}
            onClose={onClose}
            isLoading={loadingAttempt}
          />
        ) : (
          <>
            <ProgressBar
              statusLabel={statusLabel}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              attemptProgress={attemptProgress}
              answeredCount={answeredCount}
              scoreEarned={accuracyPct}
              totalPoints={totalPoints}
            />

            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                key={currentQuestion?.id ?? currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error && <ErrorAlert message={error} />}

                <Card className="p-8 mb-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                  {loadingAttempt && !currentQuestion ? (
                    <LoadingCard message="Loading question..." />
                  ) : currentQuestion ? (
                    <>
                      <p className="text-xl font-medium text-gray-900 leading-relaxed mb-8">
                        {currentQuestion.question}
                      </p>
                      <div>{renderOptions(currentQuestion)}</div>

                      {currentAnswer && (
                        <FeedbackPanel
                          answer={currentAnswer}
                          correctAnswer={currentQuestion.correct_answer}
                          explanation={currentQuestion.explanation}
                        />
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
                        savingAnswer ||
                        !!currentAnswer
                      }
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {savingAnswer ? "Saving..." : "Don't know"}
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
                        {submitting ? "Submitting..." : "Submit quiz"}
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};
