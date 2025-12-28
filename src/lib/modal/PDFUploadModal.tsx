import {
  createNewWorkSpace,
  DocumentStatus,
  getDocumentApi,
  uploadDocumentApi,
} from "@/utils/_apis/learnPlayground-api";
import {
  Check,
  FileText,
  Image,
  Music,
  UploadCloud,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SetActiveModalType } from "./AddContantModal";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "../chat/chatInput";
import { Progress } from "@/components/ui/progress";
import { Document, pdfjs } from "react-pdf";
import LazyPage from "./document/LazyPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFDocument } from "pdf-lib";
import { t } from "i18next";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface UploadState {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  documentId: string | null;
  status: DocumentStatus | null;
  downloadUrl: string | null;
}

interface Chapter {
  title: string;
  pageNumber: number | null;
}

async function slicePdfByPages(
  originalFile: File,
  selectedPages: number[]
): Promise<File> {
  if (selectedPages.length === 0) return originalFile;

  const uniqueSortedPages = Array.from(new Set(selectedPages)).sort(
    (a, b) => a - b
  );

  const arrayBuffer = await originalFile.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const pageIndices = uniqueSortedPages
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < srcDoc.getPageCount());

  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((p: any) => newDoc.addPage(p));

  const pdfBytes = (await newDoc.save()) as any;

  const originalName = originalFile.name || "document.pdf";
  const dotIndex = originalName.lastIndexOf(".");
  const baseName =
    dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;

  const newFileName = `${baseName}-selected.pdf`;

  return new File([pdfBytes], newFileName, { type: "application/pdf" });
}

enum UploadSteps {
  PDFUpload = 0,
  PDFPageSelect = 1,
}

export default function PDFUploadModal({
  handleClose,
  setActiveModal,
  isRTL,
}: {
  handleClose: (update?: boolean) => void;
  setActiveModal: SetActiveModalType;
  isRTL: boolean;
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
  const [steps, setSteps] = useState(UploadSteps.PDFUpload);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    return () => {
      if (pdfFileUrl) {
        URL.revokeObjectURL(pdfFileUrl);
      }
    };
  }, [pdfFileUrl]);

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
      setPdfFileUrl(null);
      setNumPages(0);
      setSelectedPages([]);
      setChapters([]);
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

    if (pdfFileUrl) URL.revokeObjectURL(pdfFileUrl);
    const url = URL.createObjectURL(file);
    setPdfFileUrl(url);
    setSelectedPages([]);
    setChapters([]);
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
          handleClose(true);
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

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
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
    setSteps(UploadSteps.PDFPageSelect);
    processSelectedFiles(droppedFiles);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    processSelectedFiles(selectedFiles);
    setSteps(UploadSteps.PDFPageSelect);
    if (e.target) {
      e.target.value = "";
    }
  }

  const handleDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages || 0);

    try {
      const outline = await pdf.getOutline();
      if (!outline) {
        setChapters([]);
        return;
      }

      const chaptersCollected: Chapter[] = [];

      const walkOutline = async (items: any[]) => {
        for (const item of items) {
          let pageNumber: number | null = null;
          if (item.dest) {
            try {
              const pageIndex = await pdf.getPageIndex(item.dest[0]);
              pageNumber = pageIndex + 1;
            } catch {
              pageNumber = null;
            }
          }
          chaptersCollected.push({
            title: item.title || "Untitled",
            pageNumber,
          });
          if (item.items && item.items.length > 0) {
            await walkOutline(item.items);
          }
        }
      };

      await walkOutline(outline);
      const filtered = chaptersCollected.filter(
        (c) => c.pageNumber !== null && c.pageNumber >= 1
      ) as Chapter[];

      setChapters(filtered);
    } catch {
      setChapters([]);
    }
  };

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
      const originalFile = uploadState.files[0];

      const fileToUpload =
        selectedPages.length > 0
          ? await slicePdfByPages(originalFile, selectedPages)
          : originalFile;

      const upload = await uploadDocumentApi({ file: fileToUpload });

      await createNewWorkSpace({
        documentId: upload.documentId!,
        workspaceName: originalFile.name,
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

  function toggleChapterSelection(chapterIndex: number) {
    const chapter = chapters[chapterIndex];
    if (!chapter || !chapter.pageNumber || numPages === 0) return;

    const start = chapter.pageNumber;
    const nextChapter = chapters[chapterIndex + 1];

    const end =
      nextChapter && nextChapter.pageNumber
        ? nextChapter.pageNumber - 1
        : numPages;

    const chapterPages: number[] = [];
    for (let p = start; p <= end; p++) {
      chapterPages.push(p);
    }

    setSelectedPages((prev) => {
      const allSelected = chapterPages.every((p) => prev.includes(p));

      if (allSelected) {
        return prev.filter((p) => !chapterPages.includes(p));
      } else {
        const set = new Set(prev);
        chapterPages.forEach((p) => set.add(p));
        return Array.from(set).sort((a, b) => a - b);
      }
    });
  }

  return (
    <>
      <DialogHeader className={isRTL ? "text-right" : "text-left"}>
        <DialogTitle className={isRTL ? "text-right" : "text-left"}>
          {t("modals.addContent.uploadPdf.title", "Upload PDF")}
        </DialogTitle>
        <DialogDescription className={isRTL ? "text-right" : "text-left"}>
          {t(
            "modals.addContent.uploadPdf.helper",
            "Drag and drop your PDF or choose one to upload. You can also select specific pages or chapters before uploading."
          )}
        </DialogDescription>
      </DialogHeader>

      {steps == UploadSteps.PDFUpload && (
        <>
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
                : t(
                    "modals.addContent.upload.dragIdle",
                    "Drag & Drop your PDF"
                  )}
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
                {t("modals.addContent.selectedFile", "Selected file:")}
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
        </>
      )}

      {steps == UploadSteps.PDFPageSelect && (
        <Document file={pdfFileUrl} onLoadSuccess={handleDocumentLoadSuccess}>
          {/* Header */}
          <div className="mb-4 space-y-1">
            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t(
                "modals.addContent.pageSelection.title",
                "Select pages to upload"
              )}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose individual pages or entire chapters
            </p>
          </div>

          {/* Pages Card */}
          <div className="relative rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm">
            <div className="border-b px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Pages
            </div>

            <ScrollArea className="h-[480px] px-4 py-3">
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: numPages }, (_, i) => {
                  const pageNumber = i + 1;

                  return (
                    <LazyPage
                      key={pageNumber}
                      pageNumber={pageNumber}
                      isSelected={selectedPages.includes(pageNumber)}
                      onToggle={() =>
                        setSelectedPages((prev) =>
                          prev.includes(pageNumber)
                            ? prev.filter((p) => p !== pageNumber)
                            : [...prev, pageNumber]
                        )
                      }
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chapters */}
          {chapters.length > 0 && (
            <div className="mt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="chapters" className="border-none">
                  <AccordionTrigger className="text-sm font-medium">
                    Select by chapter
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="mt-3 rounded-2xl border bg-zinc-50 dark:bg-zinc-950 p-2">
                      <ScrollArea className="max-h-48">
                        <div className="space-y-2">
                          {chapters.map((chapter, index) => {
                            if (!chapter.pageNumber) return null;

                            const start = chapter.pageNumber;
                            const end = chapters[index + 1]?.pageNumber
                              ? chapters[index + 1].pageNumber! - 1
                              : numPages;

                            const chapterPages = Array.from(
                              { length: end - start + 1 },
                              (_, i) => start + i
                            );

                            const selected = chapterPages.every((p) =>
                              selectedPages.includes(p)
                            );

                            return (
                              <button
                                key={index}
                                onClick={() => toggleChapterSelection(index)}
                                className={`
                          group w-full rounded-xl px-4 py-3 text-left transition
                          ${
                            selected
                              ? "bg-blue-50 ring-1 ring-blue-600 dark:bg-blue-950/40"
                              : "bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }
                        `}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="min-w-0">
                                    <div className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                                      {chapter.title}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      Pages {start}–{end}
                                    </div>
                                  </div>

                                  <div
                                    className={`
                              h-6 w-6 rounded-full border flex items-center justify-center
                              ${
                                selected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-zinc-300 dark:border-zinc-600"
                              }
                            `}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Selection Summary */}
          <div className="mt-5 flex items-center gap-2">
            <span className="text-sm text-zinc-500">Selection</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {selectedPages.length > 0
                ? `${selectedPages.length} page(s) selected`
                : "Full PDF"}
            </span>
          </div>
        </Document>
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

      <DialogFooter>
        <div
          className={`flex w-full gap-2 ${
            isRTL ? "justify-start" : "flex-row"
          }`}
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
        </div>
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
