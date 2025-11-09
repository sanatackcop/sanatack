import {
  createNewWorkSpace,
  DocumentStatus,
  getDocumentApi,
  uploadDocumentApi,
} from "@/utils/_apis/learnPlayground-api";
import { FileText, Image, Music, UploadCloud, Video } from "lucide-react";
import { useRef, useState } from "react";
import { SetActiveModalType } from "./AddContantModal";
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "../chat/chatInput";
import { Progress } from "@/components/ui/progress";

interface UploadState {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  documentId: string | null;
  status: DocumentStatus | null;
  downloadUrl: string | null;
}

export default function PDFUploadModal({
  setActiveModal,
}: {
  setActiveModal: SetActiveModalType;
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    uploadProgress: 0,
    error: null,
    documentId: null,
    status: null,
    downloadUrl: null,
  });
  const { refreshWorkspace } = useSidebarRefresh();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const isRTL = dir === "rtl";

  function statusToProgress(status: DocumentStatus | null): number {
    switch (status) {
      case "pending":
        return 10;
      case "uploading":
        return 70;
      case "uploaded":
        return 100;
      case "failed":
        return 100;
      default:
        return 0;
    }
  }
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  function processSelectedFiles(files: File[]) {
    if (!files.length) return;

    const file = files[0];
    const mimeType = (file.type || "").toLowerCase();
    const isPdf =
      mimeType === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      clearPolling();
      setUploadState((prev) => ({
        ...prev,
        files: [],
        error: t(
          "modals.addContent.errors.pdfOnly",
          "Only PDF files are supported."
        ),
        isUploading: false,
        uploadProgress: 0,
        status: null,
        documentId: null,
        downloadUrl: null,
      }));
      return;
    }

    clearPolling();
    setUploadState((prev) => ({
      ...prev,
      files: [file],
      error: null,
      isUploading: false,
      uploadProgress: 0,
      status: null,
      documentId: null,
      downloadUrl: null,
    }));
  }

  function startPolling(documentId: string) {
    if (!documentId) return;
    clearPolling();

    const poll = async () => {
      try {
        const documentData = await getDocumentApi(documentId);
        const docStatus = documentData.status;

        setUploadState((prev) => ({
          ...prev,
          status: docStatus,
          documentId,
          uploadProgress: statusToProgress(docStatus),
          isUploading: docStatus !== "uploaded" && docStatus !== "failed",
          downloadUrl:
            docStatus === "uploaded"
              ? documentData.url ?? prev.downloadUrl
              : docStatus === "failed"
              ? null
              : prev.downloadUrl,
          error:
            docStatus === "failed"
              ? documentData.failureReason || "Upload failed"
              : null,
        }));

        if (docStatus === "uploaded" || docStatus === "failed") {
          clearPolling();
        }
      } catch (error: any) {
        clearPolling();
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          error:
            error?.message ||
            t(
              "modals.addContent.errors.documentStatus",
              "Unable to retrieve document status right now."
            ),
        }));
      }
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 5000);
  }

  // Drag hover handlers for upload area
  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate when leaving the drop zone itself
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processSelectedFiles(droppedFiles);
  }

  // Upload handlers
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    processSelectedFiles(selectedFiles);
    if (e.target) {
      e.target.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  async function handleFileUpload() {
    if (uploadState.files.length === 0) return;

    clearPolling();
    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      status: "pending",
      uploadProgress: statusToProgress("pending"),
      error: null,
      documentId: null,
      downloadUrl: null,
    }));

    try {
      const upload = await uploadDocumentApi({ file: uploadState.files[0] });
      await createNewWorkSpace({
        documentId: upload.documentId!,
        workspaceName: uploadState.files[0].name,
      });
      await refreshWorkspace().catch((error) => {
        console.error("Failed to refresh sidebar workspaces", error);
      });
      if (!upload.documentId) {
        throw new Error("Upload response is missing a document id.");
      }

      const initialStatus = upload.status ?? "pending";

      setUploadState((prev) => ({
        ...prev,
        status: initialStatus,
        documentId: upload.documentId,
        isUploading: initialStatus !== "uploaded" && initialStatus !== "failed",
        uploadProgress: statusToProgress(initialStatus),
        error: null,
        downloadUrl: null,
      }));

      if (initialStatus === "uploaded" || initialStatus === "failed") {
        clearPolling();
        return;
      }

      startPolling(upload.documentId);
    } catch (error: any) {
      clearPolling();
      setUploadState((prev) => ({
        ...prev,
        error:
          error?.error?.body ||
          error?.message ||
          "Upload failed. Please try again.",
        isUploading: false,
        status: null,
        uploadProgress: 0,
        documentId: null,
        downloadUrl: null,
      }));
    }
  }

  return (
    <>
      <DialogHeader className={isRTL ? "text-right" : "text-left"}>
        <DialogTitle>
          {t("modals.addContent.uploadPdf.title", "Upload PDF")}
        </DialogTitle>
        <DialogDescription>
          {t(
            "modals.addContent.uploadPdf.helper",
            "Drag and drop your PDF or choose one to upload."
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => uploadRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.02] shadow-lg"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                  }
                `}
        >
          {isDragActive && (
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none" />
          )}

          <UploadCloud
            className={`mx-auto mb-4 h-16 w-16 transition-all duration-200 ${
              isDragActive
                ? "scale-110 text-blue-600 dark:text-blue-400 animate-bounce"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          />
          <div
            className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
              isDragActive
                ? "text-blue-700 dark:text-blue-300"
                : "text-zinc-700 dark:text-zinc-200"
            }`}
          >
            {isDragActive
              ? t("modals.addContent.upload.dragActive", "Drop your PDF here")
              : t("modals.addContent.upload.dragIdle", "Drag & Drop your PDF")}
          </div>
          <div className="text-sm text-zinc-500 mb-6 dark:text-zinc-400">
            {t(
              "modals.addContent.upload.orBrowse",
              "or click to browse from your computer"
            )}
          </div>
          <Button
            variant="outline"
            size="default"
            className="pointer-events-none"
          >
            {t("modals.addContent.upload.choosePdf", "Choose PDF")}
          </Button>
          <input
            ref={uploadRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-xs text-zinc-400 mt-4 dark:text-zinc-500">
            {t(
              "modals.addContent.upload.supportedFormat",
              "Supported format: PDF"
            )}
          </div>
        </div>

        {uploadState.files.length > 0 && (
          <div className="space-y-3">
            <div
              className={`font-medium text-sm text-zinc-700 dark:text-zinc-300 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("modals.addContent. ", "Selected file:")}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {uploadState.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors"
                >
                  <div className="flex-shrink-0 text-zinc-500 dark:text-zinc-400">
                    <FileTypeIcon file={file} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {file.name}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadState.status && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span
                className={
                  uploadState.status === "failed"
                    ? "text-red-600"
                    : uploadState.status === "uploaded"
                    ? "text-green-600 dark:text-green-400"
                    : "text-zinc-600 dark:text-zinc-300"
                }
              >
                {uploadState.status === "uploaded"
                  ? t(
                      "modals.addContent.upload.status.complete",
                      "Upload complete"
                    )
                  : uploadState.status === "failed"
                  ? t("modals.addContent.upload.status.failed", "Upload failed")
                  : uploadState.status === "uploading"
                  ? t(
                      "modals.addContent.upload.status.uploading",
                      "Uploading to storage..."
                    )
                  : t(
                      "modals.addContent.upload.status.preparing",
                      "Preparing upload..."
                    )}
              </span>
              <span>{uploadState.uploadProgress}%</span>
            </div>
            <Progress value={uploadState.uploadProgress} className="h-2" />
          </div>
        )}

        {uploadState.error && (
          <div className="text-red-600 text-sm text-center">
            {uploadState.error}
          </div>
        )}
      </div>

      <DialogFooter
        className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      >
        <Button variant="outline" onClick={() => setActiveModal("selection")}>
          {t("common.back", "Back")}
        </Button>
        <Button
          onClick={handleFileUpload}
          disabled={
            uploadState.files.length === 0 ||
            uploadState.isUploading ||
            uploadState.status === "uploaded"
          }
        >
          {uploadState.isUploading
            ? t("modals.addContent.upload.uploading", "Uploading...")
            : uploadState.status === "uploaded"
            ? t("modals.addContent.upload.done", "Uploaded")
            : t("modals.addContent.upload.submit", "Upload PDF")}
        </Button>
      </DialogFooter>
    </>
  );
}

function FileTypeIcon({ file }: { file: File }) {
  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-5 w-5" />;
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (type.startsWith("audio/")) return <Music className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return getIcon(file.type);
}
