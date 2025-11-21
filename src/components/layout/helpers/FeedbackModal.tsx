import { FormEvent, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackMenuItem } from "../app-sidebar";
import { submitFeedback } from "@/utils/_apis/feedback-api";
import { t } from "i18next";
import { toast } from "sonner";

export default function FeedbackMenuEntry({
  item,
  isRTL,
}: {
  item: FeedbackMenuItem;
  isRTL: boolean;
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const ItemIcon = item.icon;
  const subjectInputRef = useRef<HTMLInputElement | null>(null);

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSubject = feedbackSubject.trim();
    const trimmedMessage = feedbackMessage.trim();

    if (!trimmedSubject || !trimmedMessage) {
      setFeedbackError(t("sidebar.feedbackForm.validation"));
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      await submitFeedback({
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      toast.success(t("sidebar.feedbackForm.success"));
      setFeedbackSubject("");
      setFeedbackMessage("");
    } catch (error: any) {
      const errorMessage =
        error?.error?.body ??
        error?.response?.data?.message ??
        error?.message ??
        t("sidebar.feedbackForm.error");
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : t("sidebar.feedbackForm.error")
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (!feedbackOpen) {
      return;
    }
    const id = setTimeout(() => {
      subjectInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(id);
  }, [feedbackOpen]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        className={clsx(
          "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors duration-150 group relative focus:outline-none",
          "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <ItemIcon
          size={16}
          strokeWidth={1.75}
          className="flex-shrink-0 transition-colors text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
        />
        <span
          className={clsx(
            "text-[13px] font-normal flex-1",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {item.title}
        </span>
      </button>
      <Dialog
        open={feedbackOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFeedbackOpen(false);
            setFeedbackError(null);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[420px]"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className={isRTL ? "text-right" : "text-left"}>
              {t("sidebar.feedback")}
            </DialogTitle>
            <DialogDescription className={isRTL ? "text-right" : "text-left"}>
              {t("sidebar.feedbackForm.placeholderMessage")}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3 pt-2" onSubmit={handleFeedbackSubmit}>
            <div className="space-y-1">
              <Label htmlFor="feedback-subject">
                {t("sidebar.feedbackForm.subject")}
              </Label>
              <Input
                id="feedback-subject"
                ref={subjectInputRef}
                value={feedbackSubject}
                maxLength={120}
                placeholder={t("sidebar.feedbackForm.placeholderSubject")}
                onChange={(event) => {
                  setFeedbackSubject(event.target.value);
                  if (feedbackError) {
                    setFeedbackError(null);
                  }
                }}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="feedback-message">
                {t("sidebar.feedbackForm.message")}
              </Label>
              <Textarea
                id="feedback-message"
                value={feedbackMessage}
                placeholder={t("sidebar.feedbackForm.placeholderMessage")}
                onChange={(event) => {
                  setFeedbackMessage(event.target.value);
                  if (feedbackError) {
                    setFeedbackError(null);
                  }
                }}
                required
                rows={4}
              />
            </div>
            {feedbackError && (
              <p className="text-xs text-red-500">{feedbackError}</p>
            )}
            <div className={clsx("flex items-center")}>
              <Button type="submit" size="sm" disabled={feedbackLoading}>
                {feedbackLoading
                  ? t("common.loading")
                  : t("sidebar.feedbackForm.submit")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
