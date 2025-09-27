"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createQuiz } from "@/utils/_apis/learnPlayground-api";

// Example: external action provided by the app
// import { createQuiz } from "@/lib/actions/quizzes";

export default function QuizModal({
  workspaceId,
  triggerLabel,
}: {
  workspaceId: string;
  triggerLabel?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleQuizCreate = async () => {
    try {
      setSubmitting(true);
      // Replace with your real creation logic
      await createQuiz(workspaceId);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          {triggerLabel ?? t("createSet", "Generate Quiz")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("quiz.new", "Create a new quiz")}</DialogTitle>
          <DialogDescription>
            {t(
              "quiz.new.desc",
              "We'll generate a quiz based on your workspace content. You can edit it afterwards."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Body / extra options can go here */}
        <div className="mt-2 space-y-3">
          {/* Placeholder for future controls, e.g., number of questions, difficulty, etc. */}
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button onClick={handleQuizCreate} disabled={submitting}>
            {submitting
              ? t("creating", "Creating...")
              : t("createSet", "Generate Quiz")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
