import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw, Settings2, Info } from "lucide-react";
import { toast } from "sonner";
import { createNewDeepExplanationApi } from "@/utils/_apis/learnPlayground-api";
import {
  getErrorMessage,
  getRateLimitToastMessage,
  isRateLimitError,
} from "@/pages/dashboard/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Modal from "@/components/Modal";
import { LANGUAGES } from "@/lib/types";

export type ExplanationModalProps = {
  open: boolean;
  onClose: (created?: boolean) => void;
  workspaceId: string;
  anyActive: boolean;
};

export default function ExplanationModal({
  open,
  onClose,
  workspaceId,
  anyActive,
}: ExplanationModalProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";
  const initialLanguage = i18n.language?.startsWith("ar") ? "ar" : "en";

  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">(initialLanguage);

  const disabled = generating || anyActive || !workspaceId;

  const handleCreate = useCallback(async () => {
    if (disabled) return;

    setGenerating(true);
    try {
      await createNewDeepExplanationApi({ id: workspaceId, language });
      toast.success(t("explanation.modal.created", "Explanation created"));
      onClose(true);
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.loadSpaces",
        "Failed Creating Explanation."
      );
      if (isRateLimitError(err)) {
        toast.error(getRateLimitToastMessage(isRTL), { closeButton: true });
      } else {
        const msg = getErrorMessage(err, fallbackMessage);
        toast.error(msg, { closeButton: true });
      }
      console.error("Failed Creating Explanation: ", err);
      onClose();
    } finally {
      setGenerating(false);
    }
  }, [disabled, workspaceId, language, focus, t, onClose]);

  const onOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  return (
    <Modal
      dir={direction}
      className={isRTL ? "text-right" : undefined}
      open={open}
      onOpenChange={onOpenChange}
      title={t("explanation.modal.title", "Create Explanation")}
      description={t(
        "explanation.modal.description",
        "Select specific concepts and customize your Explanation."
      )}
      variant="default"
      confirmLabel={
        generating ? (
          <span className="inline-flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            {t("explanation.modal.generating", "Generating…")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            {t("common.generate", "Generate")}
          </span>
        )
      }
      cancelLabel={t("common.cancel", "Cancel")}
      onConfirm={handleCreate}
      onCancel={() => onClose()}
      isConfirmLoading={generating}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language-select">
            {t("explanation.modal.language.label", "Language")}
          </Label>
          <Select
            value={language}
            onValueChange={(val: any) => setLanguage(val)}
            disabled={generating}
          >
            <SelectTrigger id="language-select" dir={direction}>
              <SelectValue
                placeholder={t(
                  "explanation.modal.language.placeholder",
                  "Select language"
                )}
              />
            </SelectTrigger>
            <SelectContent dir={direction}>
              {LANGUAGES.map((lang, ind) => (
                <SelectItem key={ind} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {anyActive && (
        <div className="flex items-start gap-2 mt-10 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
          <Info className="h-4 w-4 mt-0.5" />
          <span>
            {t(
              "explanation.modal.activeBlock",
              "Please finish the active generation first"
            )}
          </span>
        </div>
      )}

      {disabled && !anyActive && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                {t(
                  "explanation.modal.hint",
                  "Fill the form to enable generation"
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent dir={direction}>
              {t(
                "explanation.modal.hintDetail",
                "Provide required inputs to proceed"
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Modal>
  );
}
