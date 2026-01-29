import { PlanType } from "@/context/UserContext";

export const RATE_LIMITS: Record<string, any> = {
  WORKSPACE_CHAT: {
    action: "workspace.chat.message",
    label: "AI Chat Messages",
    description: "Conversations with the AI assistant inside workspaces.",
    category: "ai",
    limits: {
      [PlanType.FREE]: 40,
      [PlanType.STARTER]: 400,
      [PlanType.ADVANCED]: 2000,
      [PlanType.UNLIMITED]: 9999,
    },
  },
  FLASHCARDS_GENERATION: {
    action: "workspace.flashcards.generate",
    label: "Flashcards Generation",
    description: "AI generated flashcard decks from workspaces.",
    category: "content",
    limits: {
      [PlanType.FREE]: 10,
      [PlanType.STARTER]: 100,
      [PlanType.ADVANCED]: 300,
      [PlanType.UNLIMITED]: 999,
    },
  },
  QUIZ_GENERATION: {
    action: "workspace.quiz.generate",
    label: "Quiz Generation",
    description: "Adaptive quizzes generated from your materials.",
    category: "content",
    limits: {
      [PlanType.FREE]: 8,
      [PlanType.STARTER]: 100,
      [PlanType.ADVANCED]: 300,
      [PlanType.UNLIMITED]: 999,
    },
  },
  SUMMARY_GENERATION: {
    action: "workspace.summary.generate",
    label: "Summary Generation",
    description: "Concise topic summaries powered by AI.",
    category: "content",
    limits: {
      [PlanType.FREE]: 20,
      [PlanType.STARTER]: 240,
      [PlanType.ADVANCED]: 600,
      [PlanType.UNLIMITED]: 999,
    },
  },
  EXPLANATION_GENERATION: {
    action: "workspace.explanation.generate",
    label: "Deep Explanation",
    description: "Detailed explanations for complex topics.",
    category: "content",
    limits: {
      [PlanType.FREE]: 15,
      [PlanType.STARTER]: 180,
      [PlanType.ADVANCED]: 500,
      [PlanType.UNLIMITED]: 899,
    },
  },
  DOCUMENT_UPLOAD: {
    action: "document.upload",
    label: "Document Uploads",
    description: "Uploaded files processed inside workspaces.",
    category: "ingest",
    limits: {
      [PlanType.FREE]: 10,
      [PlanType.STARTER]: 80,
      [PlanType.ADVANCED]: 240,
      [PlanType.UNLIMITED]: 500,
    },
  },
};

export const RATE_LIMIT_PRESET_LIST: any[] = Object.values(RATE_LIMITS);
