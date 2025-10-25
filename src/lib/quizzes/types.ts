import { GenerationStatus } from "../types";

export type QuizOption = string;
export type QuizType = "multiple_choice" | "true_false" | "scenario";
export type QuestionType = "multiple_choice" | "true_false" | "scenario";
export type Difficulty = "easy" | "medium" | "hard";
export type CognitiveLevel = "remember" | "understand" | "analyze" | "apply";

export interface AnswerEntry {
  question_id: string;
  position: number;
  selected_option: string | null;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  points: number;
  options: string[];
  question: string;
  difficulty: Difficulty;
  explanation: string;
  correct_answer: string;
  cognitive_level: CognitiveLevel;
}

export interface QuizPayload {
  questions: Question[];
  passing_score?: number | null;
  total_points?: number | null;
  duration?: number | null;
  title?: string | null;
  description?: string | null;
}

export interface QuizAttemptSummary {
  id: string;
  quizId?: string;
  workspaceId?: string | null;
  status: "in_progress" | "submitted" | "graded";
  answeredCount: number;
  totalCount: number;
  lastQuestionId?: string | null;
  lastQuestionPos: number;
  answers: AnswerEntry[];
  scoreTotal: number;
  scoreEarned: number;
  passed: boolean | null;
  startedAt: string;
  submittedAt?: string | null;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  workspaceId?: string | null;
  videoId?: string | null;
  userId?: string | null;
  status: GenerationStatus;
  title?: string | null;
  durationMinutes?: number | null;
  passingScore?: number | null;
  description?: string | null;
  questionCount?: number | null;
  totalPoints?: number | null;
  payload?: QuizPayload | null;
  latestAttempt?: QuizAttemptSummary | null;
  failureReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
