export type QuizOption = string;
export type QuizType = "multiple_choice" | "true_false" | "scenario";

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
  type: QuizType;
  points: number;
  options: QuizOption[];
  question: string;
  difficulty: string;
  explanation?: string;
  correct_answer: string;
  cognitive_level?: string;
}

export interface QuizAttemptSummary {
  id: string;
  quizId?: string;
  workspaceId?: string | null;
  status: "in_progress" | "submitted" | "graded";
  answeredCount: number;
  totalCount: number;
  progressPct: number;
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
  title: string;
  duration: number | null;
  questions: Question[];
  description?: string;
  passing_score?: number | null;
  latestAttempt?: QuizAttemptSummary | null;
}

export interface QuizListProps {
  workspaceId: string;
}
