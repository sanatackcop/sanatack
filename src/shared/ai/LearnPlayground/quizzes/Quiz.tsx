import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { Settings2 } from "lucide-react";

type QuizOption = string;
type QuizType = "multiple_choice" | "true_false" | "scenario";

interface Question {
  id: string;
  type: QuizType;
  points: number;
  options: QuizOption[];
  question: string;
  difficulty: string;
  explanation?: string;
  correct_answer: string;
  cognitive_level?: string;
}

interface Quiz {
  title: string;
  duration: number;
  questions: Question[];
  description?: string;
  passing_score?: number | null;
}

interface QuizListProps {
  workspaceId: string;
}

export const QuizList: React.FC<QuizListProps> = ({ workspaceId }) => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    setLoading(true);
    getWorkSpaceContent(workspaceId)
      .then((data) => {
        setQuizzes(data?.quizzes);
        setLoading(false);
      })
      .catch(() => {
        setQuizzes([]);
        setLoading(false);
      });
  }, [workspaceId]);

  if (selectedQuiz) {
    return (
      <QuizView quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />
    );
  }

  return (
    <>
      <motion.div
        key="quizlist"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="px-6 py-4"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">My Quizzes</h3>

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
            {quizzes.map((quiz, idx) => (
              <Card
                key={idx}
                onClick={() => setSelectedQuiz(quiz)}
                className="cursor-pointer hover:bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-medium text-gray-900">
                    {quiz.title}
                  </h4>
                  <Badge variant="secondary" className="text-sm">
                    {quiz.duration} min
                  </Badge>
                </div>
                {quiz.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {quiz.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {quiz.questions.length} Questions
                </p>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
      <Card className="relative z-0 mx-5 px-4 py-2 h-[25rem] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
        <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
          <div className="max-w-[65%]">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Create Quiz
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create quiz sets with preferred question types, difficulty, and
              more.{" "}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
              //   onClick={onCreateNew}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Generate{" "}
            </Button>
          </div>
        </div>

        <div
          className="pointer-events-none select-none absolute -left-20 bottom-0 z-0 opacity-90"
          aria-hidden
        >
          {/* <img
            src={flashcards}
            alt="Flashcards"
            className="block h-auto w-[22rem] md:w-[26rem] lg:w-[30rem] translate-x-[20px] translate-y-1/4"
          /> */}
        </div>
      </Card>
    </>
  );
};

interface QuizViewProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];

  // Handle option select for a question
  const selectAnswer = (questionId: string, option: string) => {
    if (showResults) return; // no changes after results shown
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) score += q.points;
    });
    return score;
  };

  const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0);
  const score = calculateScore();

  // Move to next question or show results
  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const restartQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  // Render options differently for each question type
  const renderOptions = (question: Question) => {
    if (question.type === "multiple_choice" || question.type === "scenario") {
      return question.options.map((opt, idx) => {
        const isSelected = userAnswers[question.id] === opt;
        const isCorrect = opt === question.correct_answer;
        const showCorrectness = showResults;

        let optClass =
          "cursor-pointer rounded-xl border border-gray-300 px-4 py-2 mb-2 inline-block w-full text-left ";
        if (showCorrectness) {
          if (isCorrect) {
            optClass +=
              "bg-green-200 border-green-400 text-green-900 font-semibold";
          } else if (isSelected && !isCorrect) {
            optClass += "bg-red-200 border-red-400 text-red-900 font-semibold";
          } else {
            optClass += "bg-gray-100 text-gray-600";
          }
        } else if (isSelected) {
          optClass += "bg-blue-200 border-blue-400 font-semibold";
        }

        return (
          <button
            key={idx}
            onClick={() => selectAnswer(question.id, opt)}
            disabled={showResults}
            className={optClass}
            type="button"
            aria-pressed={isSelected}
          >
            {opt}
          </button>
        );
      });
    }

    if (question.type === "true_false") {
      // For true/false, assume options exactly ["True", "False"]
      return ["True", "False"].map((val, idx) => {
        const isSelected = userAnswers[question.id] === val;
        const isCorrect = val === question.correct_answer;
        const showCorrectness = showResults;

        let btnClass =
          "cursor-pointer rounded-xl border border-gray-300 px-6 py-2 mr-4 text-center w-24 ";
        if (showCorrectness) {
          if (isCorrect) {
            btnClass +=
              "bg-green-200 border-green-400 text-green-900 font-semibold";
          } else if (isSelected && !isCorrect) {
            btnClass += "bg-red-200 border-red-400 text-red-900 font-semibold";
          } else {
            btnClass += "bg-gray-100 text-gray-600";
          }
        } else if (isSelected) {
          btnClass += "bg-blue-200 border-blue-400 font-semibold";
        }

        return (
          <button
            key={idx}
            onClick={() => selectAnswer(question.id, val)}
            disabled={showResults}
            className={btnClass}
            type="button"
            aria-pressed={isSelected}
          >
            {val}
          </button>
        );
      });
    }

    return null;
  };

  return (
    <motion.div
      key="quizview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="px-6 py-6 max-w-3xl mx-auto"
    >
      <Button
        variant="outline"
        className="mb-6 rounded-xl"
        onClick={onClose}
        type="button"
      >
        Back to Quizzes
      </Button>

      {!showResults ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {quiz.title}
          </h2>
          <p className="mb-6 text-gray-600 text-sm">
            Duration: {quiz.duration} minutes
          </p>

          <div className="mb-4">
            <p className="text-gray-800 font-medium mb-2">
              Question {currentIndex + 1} of {quiz.questions.length}
            </p>
            <p className="text-lg font-semibold mb-4">
              {currentQuestion.question}
            </p>
            <div>{renderOptions(currentQuestion)}</div>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={prevQuestion} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!userAnswers[currentQuestion.id]}
            >
              {currentIndex === quiz.questions.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
          <p className="text-gray-700 text-lg mb-2">
            Score: {score} / {totalPoints} points
          </p>
          {quiz.passing_score !== undefined && quiz.passing_score !== null && (
            <p
              className={
                score >= quiz.passing_score
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {score >= quiz.passing_score ? "Passed" : "Failed"} (Passing
              Score: {quiz.passing_score})
            </p>
          )}
          <Button onClick={restartQuiz} className="mt-6 rounded-xl">
            Retake Quiz
          </Button>
        </div>
      )}
    </motion.div>
  );
};
