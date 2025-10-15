import React, { useState, useRef, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  Link2,
  FileText,
  Image,
  Video,
  Music,
  BookOpen,
  Mic,
  TestTube,
} from "lucide-react";
import {
  createNewWorkSpace,
  uploadDocumentApi,
  getDocumentApi,
  DocumentStatus,
  youtubeUrlPastApi,
} from "@/utils/_apis/learnPlayground-api";
import CircularProgress from "@mui/material/CircularProgress";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
}

type ModalType =
  | "selection"
  | "upload"
  | "paste"
  | "createCourse"
  | "recordAudio";

interface UploadState {
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

  const [pasteState, setPasteState] = useState<PasteState>({
    url: "",
    text: "",
    isProcessing: false,
    error: null,
  });

  const [isDragActive, setIsDragActive] = useState(false);

  const uploadRef = useRef<HTMLInputElement | null>(null);
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
        error: "Only PDF files are supported.",
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
            error?.message || "Unable to retrieve document status right now.",
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

  function handleClose() {
    onClose();
    clearPolling();
    setActiveModal("selection");
    setIsDragActive(false);
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
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]" dir="ltr">
        {activeModal === "selection" && (
          <>
            <DialogHeader>
              <DialogTitle>Add New Learning Playground</DialogTitle>
              <DialogDescription>
                Choose how to add your content
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <ContentTypeCard
                title="Upload PDF"
                subtitle="Upload a PDF document"
                Icon={UploadCloud}
                onClick={() => setActiveModal("upload")}
              />
              <ContentTypeCard
                title="Paste URL"
                subtitle="Add content from a link"
                Icon={Link2}
                onClick={() => setActiveModal("paste")}
              />
              <ContentTypeCard
                title="Create Course"
                subtitle="Generate a course from content"
                Icon={BookOpen}
                onClick={() => setActiveModal("createCourse")}
              />
              <ContentTypeCard
                title="Record Audio"
                subtitle="Record and add audio content"
                Icon={Mic}
                onClick={() => setActiveModal("recordAudio")}
              />
              <div className=" col-span-2">
                <ContentTypeCard
                  title="Research"
                  subtitle="Do Your Research With Ease"
                  Icon={TestTube}
                  onClick={() => setActiveModal("recordAudio")}
                />
              </div>
            </div>
          </>
        )}

        {activeModal === "upload" && (
          <>
            <DialogHeader>
              <DialogTitle>Upload PDF</DialogTitle>
              <DialogDescription>
                Drag and drop your PDF or choose one to upload.
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
                      : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
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
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <div
                  className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
                    isDragActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {isDragActive ? "Drop your PDF here" : "Drag & Drop your PDF"}
                </div>
                <div className="text-sm text-gray-500 mb-6 dark:text-gray-400">
                  or click to browse from your computer
                </div>
                <Button
                  variant="outline"
                  size="default"
                  className="pointer-events-none"
                >
                  Choose PDF
                </Button>
                <input
                  ref={uploadRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-xs text-gray-400 mt-4 dark:text-gray-500">
                  Supported format: PDF
                </div>
              </div>

              {uploadState.files.length > 0 && (
                <div className="space-y-3">
                  <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Selected file:
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {uploadState.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                          <FileTypeIcon file={file} />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
                          : "text-gray-600 dark:text-gray-300"
                      }
                    >
                      {uploadState.status === "uploaded"
                        ? "Upload complete"
                        : uploadState.status === "failed"
                        ? "Upload failed"
                        : uploadState.status === "uploading"
                        ? "Uploading to storage..."
                        : "Preparing upload..."}
                    </span>
                    <span>{uploadState.uploadProgress}%</span>
                  </div>
                  <Progress
                    value={uploadState.uploadProgress}
                    className="h-2"
                  />
                  {uploadState.status === "uploaded" &&
                    uploadState.downloadUrl && (
                      <div className="text-sm text-center text-green-600 dark:text-green-400">
                        <a
                          href={uploadState.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View document
                        </a>
                      </div>
                    )}
                </div>
              )}

              {uploadState.error && (
                <div className="text-red-600 text-sm text-center">
                  {uploadState.error}
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                Back
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={
                  uploadState.files.length === 0 || uploadState.isUploading
                }
              >
                {uploadState.isUploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "paste" && (
          <>
            <DialogHeader>
              <DialogTitle>Paste URL</DialogTitle>
              <DialogDescription>
                Paste a URL from YouTube or other sources
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="url" className="block mb-2">
                  URL
                </Label>
                <Input
                  id="url"
                  placeholder="https://youtube.com/watch?v=..."
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

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                Back
              </Button>
              <Button
                onClick={handlePasteSubmit}
                disabled={!pasteState.url || pasteState.isProcessing}
              >
                {pasteState.isProcessing ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={20} />
                    Processing...
                  </div>
                ) : (
                  "Process Content"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "createCourse" && (
          <>
            <DialogHeader>
              <DialogTitle>Create Course</DialogTitle>
              <DialogDescription>
                Course creation functionality goes here.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}

        {activeModal === "recordAudio" && (
          <>
            <DialogHeader>
              <DialogTitle>Record Audio</DialogTitle>
              <DialogDescription>
                Audio recording functionality goes here.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal("selection")}
              >
                Back
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
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  Icon: any;
}) {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      className="group relative p-6 w-full flex flex-col items-start justify-center gap-y-2 rounded-2xl border shadow-sm 
        cursor-pointer transition-all dark:bg-gray-900 dark:border-gray-800 bg-white border-gray-200
        hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700
        focus:outline-none"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Icon className="h-8 w-8 text-gray-500 opacity-85 group-hover:text-gray-800 group-hover:opacity-100 dark:text-gray-400 dark:group-hover:text-gray-200 transition-all duration-200" />
      <h3 className="font-medium text-base text-gray-600 opacity-90 group-hover:text-gray-900 group-hover:opacity-100 dark:text-gray-300 dark:group-hover:text-gray-100 transition-all duration-200">
        {title}
      </h3>
      <div className="text-sm text-gray-500 opacity-85 group-hover:text-gray-800 group-hover:opacity-100 dark:text-gray-400 dark:group-hover:text-gray-200 transition-all duration-200">
        {subtitle}
      </div>
    </div>
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
