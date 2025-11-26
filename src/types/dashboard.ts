export type LearningHabitKey =
  | "create_three_workspaces"
  | "create_three_spaces"
  | "create_three_quizzes_flashcards"
  | "upload_one_document";

export interface LearningHabitTask {
  key: LearningHabitKey;
  completed: boolean;
  current: number;
  target: number;
}

export interface LearningHabitProgress {
  tasks: LearningHabitTask[];
  completedCount: number;
  totalCount: number;
}
