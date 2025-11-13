import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "i18next";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import {
  createNewWorkSpace,
  youtubeUrlPastApi,
} from "@/utils/_apis/learnPlayground-api";
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";
import { useNavigate } from "react-router-dom";
import { SetActiveModalType } from "./AddContantModal";

interface PasteState {
  url: string;
  text: string;
  isProcessing: boolean;
  error: string | null;
}

export default function VideoModal({
  handleClose,
  setActiveModal,
}: {
  handleClose: () => void;
  setActiveModal: SetActiveModalType;
}) {
  const [pasteState, setPasteState] = useState<PasteState>({
    url: "",
    text: "",
    isProcessing: false,
    error: null,
  });
  const { refreshWorkspace } = useSidebarRefresh();
  const navigate = useNavigate();

  async function handlePasteSubmit() {
    if (!pasteState.url && !pasteState.text) return;

    setPasteState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const getYoutubeVIdeo: any = await youtubeUrlPastApi({
        url: pasteState.url,
      });

      const workSpace: any = await createNewWorkSpace({
        youtubeVideoId: getYoutubeVIdeo.id,
        workspaceName: getYoutubeVIdeo.info.title,
      });
      await refreshWorkspace().catch((error) => {
        console.error("Failed to refresh sidebar workspaces", error);
      });
      navigate(`/dashboard/learn/workspace/${workSpace.workspace.id}`);
      handleClose();
    } catch (error: any) {
      setPasteState((prev) => ({
        ...prev,
        error: error.message || "Processing failed",
        isProcessing: false,
      }));
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("modals.addContent.pasteUrl.title", "Paste URL")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "modals.addContent.pasteUrl.helper",
            "Paste a URL from YouTube or other sources"
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="url" className={`block mb-2`}>
            {t("modals.addContent.pasteUrl.label", "URL")}
          </Label>
          <Input
            id="url"
            placeholder={t(
              "modals.addContent.pasteUrl.placeholder",
              "https://youtube.com/watch?v=..."
            )}
            value={pasteState.url}
            onChange={(e) =>
              setPasteState((prev) => ({
                ...prev,
                url: e.target.value,
              }))
            }
          />
        </div>

        {pasteState.error && (
          <div className="text-red-600 text-sm text-center">
            {pasteState.error}
          </div>
        )}
      </div>

      <DialogFooter className={`flex gap-2`}>
        <Button variant="outline" onClick={() => setActiveModal("selection")}>
          {t("common.back", "Back")}
        </Button>
        <Button
          onClick={handlePasteSubmit}
          disabled={!pasteState.url || pasteState.isProcessing}
        >
          {pasteState.isProcessing ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} />
              {t("modals.addContent.pasteUrl.processing", "Processing...")}
            </div>
          ) : (
            t("modals.addContent.pasteUrl.submit", "Process Content")
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
