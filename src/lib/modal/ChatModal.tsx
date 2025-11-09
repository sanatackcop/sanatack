import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";
import { createNewWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { t } from "i18next";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetActiveModalType } from "./AddContantModal";

export default function ChatModal({
  handleClose,
  setActiveModal,
}: {
  handleClose: () => void;
  setActiveModal: SetActiveModalType;
}) {
  const { refreshWorkspace } = useSidebarRefresh();
  const navigate = useNavigate();
  const [chatState, setChatState] = useState<{
    name: string;
    isCreating: boolean;
    error: string | null;
  }>({
    name: "",
    isCreating: false,
    error: null,
  });

  async function handleChatWorkspaceCreate() {
    const trimmedName = chatState.name.trim();
    if (!trimmedName) {
      setChatState((prev) => ({
        ...prev,
        error: t(
          "modals.addContent.chatWorkspace.errors.nameRequired",
          "Please enter a workspace name."
        ),
      }));
      return;
    }

    setChatState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const workspace: any = await createNewWorkSpace({
        workspaceName: trimmedName,
      });
      await refreshWorkspace().catch((error) => {
        console.error("Failed to refresh sidebar workspaces", error);
      });
      navigate(`/dashboard/learn/workspace/${workspace.workspace.id}`);
      handleClose();
    } catch (error: any) {
      setChatState((prev) => ({
        ...prev,
        error:
          error?.error?.body ||
          error?.message ||
          t(
            "modals.addContent.chatWorkspace.errors.generic",
            "Failed to create workspace."
          ),
      }));
    } finally {
      setChatState((prev) => ({ ...prev, isCreating: false }));
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("modals.addContent.chatWorkspace.title", "Chat Workspace")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "modals.addContent.chatWorkspace.helper",
            "Create a space to chat without uploading materials."
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="chat-workspace-name">
            {t("modals.addContent.chatWorkspace.label", "Workspace name")}
          </Label>
          <Input
            id="chat-workspace-name"
            value={chatState.name}
            onChange={(e) =>
              setChatState((prev) => ({
                ...prev,
                name: e.target.value,
                error: null,
              }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleChatWorkspaceCreate();
              }
            }}
            placeholder={t(
              "modals.addContent.chatWorkspace.placeholder",
              "e.g. Brainstorming session"
            )}
            disabled={chatState.isCreating}
          />
          {chatState.error ? (
            <p className="text-sm text-red-500">{chatState.error}</p>
          ) : null}
        </div>
      </div>

      <DialogFooter className={`flex gap-2`}>
        <Button
          variant="outline"
          onClick={() => setActiveModal("selection")}
          disabled={chatState.isCreating}
        >
          {t("common.back", "Back")}
        </Button>
        <Button
          onClick={handleChatWorkspaceCreate}
          disabled={chatState.isCreating}
        >
          {chatState.isCreating ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("modals.addContent.chatWorkspace.creating", "Creating...")}
            </span>
          ) : (
            t("modals.addContent.chatWorkspace.submit", "Create workspace")
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
