import { useCallback, useEffect, useState } from "react";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import useGenerationNotifications from "@/hooks/useGenerationNotifications";
import { Summary } from "@/lib/summary/Summary";
import { FlashcardDeck } from "@/lib/flashcards/types";
import { Quiz } from "@/lib/quizzes/types";
import { Explanation } from "@/lib/explantion/DeepExplnation";
import { normalizeQuiz } from "@/lib/quizzes/utils";

type Snapshot = {
  summaries: Summary[];
  flashcards: FlashcardDeck[];
  quizzes: Quiz[];
  explanations: Explanation[];
};

const EMPTY_SNAPSHOT: Snapshot = {
  summaries: [],
  flashcards: [],
  quizzes: [],
  explanations: [],
};

const POLL_INTERVAL_MS = 3500;

export function WorkspaceGenerationWatcher({
  workspaceId,
}: {
  workspaceId?: string | null;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY_SNAPSHOT);

  const refreshSnapshot = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const response = await getWorkSpaceContent(workspaceId);
      setSnapshot({
        summaries: Array.isArray(response?.summaries)
          ? response.summaries
          : [],
        flashcards: Array.isArray(response?.flashcards)
          ? (response.flashcards as FlashcardDeck[]).filter(Boolean)
          : [],
        quizzes: Array.isArray(response?.quizzes)
          ? response.quizzes.map((quiz: any) => normalizeQuiz(quiz))
          : [],
        explanations: Array.isArray(response?.explanations)
          ? (response.explanations as Explanation[]).filter(Boolean)
          : [],
      });
    } catch (error) {
      console.error("Failed to refresh workspace generation status:", error);
    }
  }, [workspaceId]);

  useEffect(() => {
    setSnapshot(EMPTY_SNAPSHOT);
    if (workspaceId) {
      refreshSnapshot();
    }
  }, [workspaceId, refreshSnapshot]);

  useEffect(() => {
    if (!workspaceId) return;
    const interval = window.setInterval(() => {
      refreshSnapshot();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [workspaceId, refreshSnapshot]);

  useGenerationNotifications(snapshot.summaries, {
    entity: "summary",
    getName: (summary) =>
      summary.payload?.title || summary.payload?.structure?.[0]?.section,
  });

  useGenerationNotifications(snapshot.flashcards, {
    entity: "flashcards",
    getName: (set) => set.title,
  });

  useGenerationNotifications(snapshot.quizzes, {
    entity: "quiz",
    getName: (quiz) => quiz.title,
  });

  useGenerationNotifications(snapshot.explanations, {
    entity: "explanation",
    getName: (explanation) => explanation.payload?.title,
  });

  return null;
}

export default WorkspaceGenerationWatcher;
