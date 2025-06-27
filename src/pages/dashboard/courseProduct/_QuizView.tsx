import { useEffect, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { QuizGroup } from "@/utils/types/adminTypes";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Answers {
  [key: number]: number;
}

export default function QuizView({
  quizGroup,
}: {
  quizGroup: QuizGroup;
}): JSX.Element {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes: QuizQuestion[] = [];

        quizGroup.quizzes?.forEach((quiz: any) => {
          const correct = quiz.options.indexOf(quiz.correctAnswer);
          quizzes.push({
            question: quiz.question,
            options: quiz.options,
            correct,
          });
        });

        setQuizData(quizzes);
      } catch (error) {
        console.error("Error loading quiz data:", error);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswerSelect = (answerIndex: number): void => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = (): void => {
    if (selectedAnswer !== null) {
      setAnswers({ ...answers, [currentQuestion]: selectedAnswer });

      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const handlePrevQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const calculateScore = (): number => {
    let score = 0;
    Object.keys(answers).forEach((questionIndex: string) => {
      if (
        answers[parseInt(questionIndex)] ===
        quizData[parseInt(questionIndex)].correct
      ) {
        score++;
      }
    });
    return score;
  };

  const resetQuiz = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResults(false);
  };

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-white">
        جاري تحميل الأسئلة...
      </div>
    );
  }

  const score: number = calculateScore();
  const percentage: number = Math.round((score / quizData.length) * 100);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            اختبار المعرفة العامة
          </h1>
        </div>

        {!showResults ? (
          <>
            {/* Progress */}
            <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 mb-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  السؤال {currentQuestion + 1} من {quizData.length}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {Math.round(((currentQuestion + 1) / quizData.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / quizData.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-6 leading-relaxed text-gray-800 dark:text-white">
                {quizData[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {quizData[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {selectedAnswer === index && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestion === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                السؤال السابق
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedAnswer === null
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg"
                }`}
              >
                {currentQuestion === quizData.length - 1
                  ? "إنهاء الاختبار"
                  : "السؤال التالي"}
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 rounded-xl shadow-lg text-center bg-white dark:bg-gray-800">
            <div className="mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  percentage >= 70
                    ? "bg-green-100 text-green-600"
                    : percentage >= 50
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {percentage >= 70 ? <Check size={40} /> : <X size={40} />}
              </div>

              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                انتهى الاختبار!
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300">
                لقد حصلت على {score} من {quizData.length} إجابات صحيحة
              </p>
            </div>

            <div className="mb-8">
              <div
                className={`text-6xl font-bold mb-2 ${
                  percentage >= 70
                    ? "text-green-500"
                    : percentage >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {percentage}%
              </div>

              <p className="text-lg text-gray-500 dark:text-gray-400">
                {percentage >= 90
                  ? "ممتاز! أداء رائع"
                  : percentage >= 70
                  ? "جيد جداً! استمر"
                  : percentage >= 50
                  ? "جيد، يمكنك التحسن"
                  : "تحتاج إلى مزيد من المراجعة"}
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
            >
              <RotateCcw size={20} />
              إعادة الاختبار
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
