import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Link2, Loader2 } from "lucide-react";
import {
  createNewWorkSpace,
  DocumentStatus,
  youtubeUrlPastApi,
} from "@/utils/_apis/learnPlayground-api";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";
import PDFUploadModal from "./PDFUploadModal";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
}

export type ModalType =
  | "selection"
  | "upload"
  | "paste"
  | "chat"
  | "createCourse"
  | "recordAudio";

export interface UploadState {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  documentId: string | null;
  status: DocumentStatus | null;
  downloadUrl: string | null;
}

interface PasteState {
  url: string;
  text: string;
  isProcessing: boolean;
  error: string | null;
}

export function AddContentModal({ open, onClose }: AddContentModalProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const isRTL = dir === "rtl";
  const { refreshWorkspace } = useSidebarRefresh();

  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>("selection");

  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    uploadProgress: 0,
    error: null,
    documentId: null,
    status: null,
    downloadUrl: null,
  });

  const [chatState, setChatState] = useState<{
    name: string;
    isCreating: boolean;
    error: string | null;
  }>({
    name: "",
    isCreating: false,
    error: null,
  });

  const [pasteState, setPasteState] = useState<PasteState>({
    url: "",
    text: "",
    isProcessing: false,
    error: null,
  });

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  function clearPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

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

  useEffect(() => {
    if (activeModal === "upload") {
      if (uploadState.status === "uploaded") {
        handleClose();
      }
    }
  }, [uploadState]);

  useEffect(() => {
    if (activeModal === "chat") {
      setChatState((prev) => ({ ...prev, error: null }));
    }
  }, [activeModal]);

  function handleClose() {
    onClose();
    clearPolling();
    setActiveModal("selection");
    setUploadState({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,
      documentId: null,
      status: null,
      downloadUrl: null,
    });
    setPasteState({
      url: "",
      text: "",
      isProcessing: false,
      error: null,
    });
    setChatState({
      name: "",
      isCreating: false,
      error: null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-[600px]"
        dir={dir}
        lang={i18n.language}
      >
        {activeModal === "selection" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle>
                {t("modals.addContent.title", "Add New Learning Playground")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "modals.addContent.subtitle",
                  "Choose how to add your content"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <ContentTypeCard
                title={t("modals.addContent.uploadPdf.title", "Upload PDF")}
                subtitle={t(
                  "modals.addContent.uploadPdf.subtitle",
                  "Upload a PDF document"
                )}
                Icon={UploadCloud}
                isRTL={isRTL}
                onClick={() => setActiveModal("upload")}
              />
              <ContentTypeCard
                title={t("modals.addContent.pasteUrl.title", "Paste URL")}
                subtitle={t(
                  "modals.addContent.pasteUrl.subtitle",
                  "Add content from a link"
                )}
                Icon={Link2}
                isRTL={isRTL}
                onClick={() => setActiveModal("paste")}
              />
              {/* <div className="col-span-2">
                <ContentTypeCard
                  title={t(
                    "modals.addContent.chatWorkspace.title",
                    "Chat Workspace"
                  )}
                  subtitle={t(
                    "modals.addContent.chatWorkspace.subtitle",
                    "Start a workspace focused on conversation"
                  )}
                  Icon={MessageCircle}
                  isRTL={isRTL}
                  onClick={() => setActiveModal("chat")}
                />
              </div> */}
              {/* <ContentTypeCard
                title={t(
                  "modals.addContent.createCourse.title",
                  "Create Course"
                )}
                subtitle={t(
                  "modals.addContent.createCourse.subtitle",
                  "Generate a course from content"
                )}
                Icon={BookOpen}
                isRTL={isRTL}
                onClick={() => setActiveModal("createCourse")}
              />
              <ContentTypeCard
                title={t("modals.addContent.recordAudio.title", "Record Audio")}
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={Mic}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <ContentTypeCard
                title="Learngin Session"
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={PencilRulerIcon}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <ContentTypeCard
                title="Book Summary Workshop"
                subtitle={t(
                  "modals.addContent.recordAudio.subtitle",
                  "Record and add audio content"
                )}
                Icon={Spade}
                isRTL={isRTL}
                onClick={() => setActiveModal("recordAudio")}
              />
              <div className=" col-span-2">
                <ContentTypeCard
                  title={t("modals.addContent.research.title", "Research")}
                  subtitle={t(
                    "modals.addContent.research.subtitle",
                    "Do Your Research With Ease"
                  )}
                  Icon={TestTube}
                  isRTL={isRTL}
                  onClick={() => setActiveModal("recordAudio")}
                />
              </div> */}
            </div>
          </>
        )}

        {activeModal === "chat" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
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
                  dir={dir}
                />
                {chatState.error ? (
                  <p className="text-sm text-red-500">{chatState.error}</p>
                ) : null}
              </div>
            </div>

            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
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
                    {t(
                      "modals.addContent.chatWorkspace.creating",
                      "Creating..."
                    )}
                  </span>
                ) : (
                  t(
                    "modals.addContent.chatWorkspace.submit",
                    "Create workspace"
                  )
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "upload" && (
          <PDFUploadModal setActiveModal={setActiveModal} />
        )}

        {activeModal === "paste" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
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
                <Label
                  htmlFor="url"
                  className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("modals.addContent.pasteUrl.label", "URL")}
                </Label>
                <Input
                  id="url"
                  dir={isRTL ? "rtl" : "ltr"}
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

            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                {t("common.back", "Back")}
              </Button>
              <Button
                onClick={handlePasteSubmit}
                disabled={!pasteState.url || pasteState.isProcessing}
              >
                {pasteState.isProcessing ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={20} />
                    {t(
                      "modals.addContent.pasteUrl.processing",
                      "Processing..."
                    )}
                  </div>
                ) : (
                  t("modals.addContent.pasteUrl.submit", "Process Content")
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "createCourse" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle>
                {t("modals.addContent.createCourse.title", "Create Course")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "modals.addContent.createCourse.helper",
                  "Course creation functionality goes here."
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                {t("common.back", "Back")}
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "recordAudio" && (
          <>
            <DialogHeader className={isRTL ? "text-right" : "text-left"}>
              <DialogTitle>
                {t("modals.addContent.recordAudio.title", "Record Audio")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "modals.addContent.recordAudio.helper",
                  "Audio recording functionality goes here."
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                {t("common.back", "Back")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ContentTypeCard({
  title,
  subtitle,
  onClick,
  Icon,
  isRTL,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  Icon: any;
  isRTL: boolean;
}) {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      className={`group relative p-6 w-full flex flex-col ${
        isRTL ? "items-end" : "items-start"
      } justify-center gap-y-2 rounded-2xl border shadow-sm 
        cursor-pointer transition-all dark:bg-zinc-900 dark:border-zinc-800 bg-white border-zinc-200
        hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700
        focus:outline-none`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Icon className="h-8 w-8 text-zinc-500 opacity-85 group-hover:text-zinc-800 group-hover:opacity-100 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-all duration-200" />
      <h3
        className={`font-medium text-base text-zinc-600 opacity-90 group-hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-300 dark:group-hover:text-zinc-100 transition-all duration-200 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {title}
      </h3>
      <div
        className={`text-sm text-zinc-500 opacity-85 group-hover:text-zinc-800 group-hover:opacity-100 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-all duration-200 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {subtitle}
      </div>
    </div>
  );
}
