import { GenerationStatus } from "../types";

export interface Flashcard {
  id?: string;
  term?: string;
  front?: string;
  definition?: string;
  back?: string;
  examples?: string[];
  memory_aids?: string[];
  reviewed?: boolean;
  due?: boolean;
  starred?: boolean;
  difficulty?: number; // 1: Again, 2: Hard, 3: Good, 4: Easy
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  categories: string[];
  status: GenerationStatus;
  flashcards: Flashcard[];
}

export interface CircularProgressProps {
  reviewed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export interface DeleteModalState {
  isOpen: boolean;
  setToDelete: FlashcardDeck | null;
}
