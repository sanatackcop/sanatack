import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import "reactflow/dist/style.css";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GenerationStatus } from "../types";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import { SummaryView } from "./SummaryView";
import GenerateContentComponent from "@/shared/workspaces/Generate";
import SummaryModal from "./SummaryModal";
import useGenerationNotifications from "@/hooks/useGenerationNotifications";

export interface MindMap {
  root: string;
  nodes: MindMapNode[];
}

export interface Summary {
  id: string;
  created_at: string;
  updated_at: string;
  userId: string;
  workspaceId: string;
  videoId: string;
  documentId: string | null;
  language: string;
  status: GenerationStatus;
  payload?: SummaryPayload;
  failureReason?: string | null;
}

export interface SummaryPayload {
  title: string;
  mind_map: {
    root: string;
    nodes: MindMapNode[];
  };
  overview: string;
  structure: {
    content: string;
    section: string;
    sub_points: string[];
  }[];
  study_tips: string[];
  main_points: string[];
  key_concepts: {
    concept: string;
    definition: string;
    importance: string;
  }[];
  practical_applications: string[];
  visuals?: {
    photo_prompts: string[];
    chart_ideas: {
      title: string;
      chart_type: "bar" | "line" | "pie" | "donut" | "area";
      description: string;
      data_points: (
        | string
        | {
            name?: string;
            label?: string;
            category?: string;
            value?: number | string;
            amount?: number | string;
            count?: number | string;
            total?: number | string;
            percentage?: number | string;
          }
      )[];
    }[];
  };
}

export type MindMapNode = {
  id: string;
  label: string;
  children: MindMapNode[];
};

export interface SummaryListProps {
  workspaceId: string;
}

export interface SummaryViewProps {
  summary: Summary;
  onClose: () => void;
}

const POLL_INTERVAL_MS = 3500;

export function SummaryList({ workspaceId }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction == "rtl";
  const isMountedRef = useRef(true);

  const handleCreateSummary = useCallback(() => {
    setModalOpen(true);
  }, []);

  function handleClosingModalSummaryCreate(created?: boolean) {
    setModalOpen(false);
    if (created) setRefresh(!refresh);
  }

  const anyActive = useMemo(
    () =>
      summaries.some(
        (x) => x.status === "pending" || x.status === "processing"
      ),
    [summaries]
  );

  useGenerationNotifications(summaries, {
    entity: "summary",
    getName: (summary) =>
      summary.payload?.title || summary.payload?.structure?.[0]?.section,
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchSummaries = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setLoading(true);
      try {
        const data = await getWorkSpaceContent(workspaceId);
        if (!isMountedRef.current) return;
        setSummaries(data.summaries ?? []);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Failed to fetch summaries:", err);
        setSummaries([]);
        setError("summary.fetchError");
      } finally {
        if (!isMountedRef.current) return;
        if (!silent) setLoading(false);
      }
    },
    [workspaceId]
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchSummaries();
  }, [fetchSummaries, refresh]);

  useEffect(() => {
    if (!anyActive) return;
    const interval = window.setInterval(() => {
      fetchSummaries({ silent: true });
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [anyActive, fetchSummaries]);

  if (selectedSummary) {
    return (
      <SummaryView
        summary={selectedSummary}
        onClose={() => setSelectedSummary(null)}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full">
      <ScrollArea className="h-full w-full">
        <motion.div
          key="list"
          dir={direction}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-full mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4"
        >
          <div className="px-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-white">
              {t("summary.list.title", "Summaries")}
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-3 sm:p-4 h-28 sm:h-32 animate-pulse bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive dark:text-red-400 px-2">
              {t(error, "Failed to fetch summaries. Please try again.")}
            </div>
          ) : summaries.length === 0 ? (
            <></>
          ) : (
            <div className="space-y-3 w-full">
              {summaries.map((summary) => {
                const disabled =
                  summary.status === GenerationStatus.PENDING ||
                  summary.status === GenerationStatus.PROCESSING;
                const failed = summary.status === GenerationStatus.FAILED;
                const completed = summary.status === GenerationStatus.COMPLETED;

                return (
                  <Card
                    key={summary.id}
                    role="button"
                    aria-disabled={disabled}
                    aria-busy={disabled}
                    onClick={() =>
                      !disabled &&
                      !failed &&
                      completed &&
                      summary.payload &&
                      setSelectedSummary(summary)
                    }
                    className={`group relative overflow-hidden w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col rounded-xl sm:rounded-2xl justify-center shadow-sm border transition-all duration-200 cursor-pointer ${
                      failed
                        ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800"
                        : "bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:border-gray-300/80 dark:hover:border-zinc-700"
                    } ${disabled ? "pointer-events-auto" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-2 sm:gap-3 min-w-0 w-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white break-words min-w-0 flex-1">
                            {summary.payload?.title ??
                              t(
                                "summary.list.generating",
                                "Generating summary..."
                              )}
                          </h3>
                          <div className="flex-shrink-0">
                            <StatusBadge
                              status={summary.status}
                              isRTL={isRTL}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {failed && (
                      <div className="mt-3 w-full rounded-lg sm:rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-3 py-2 text-xs sm:text-sm flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">
                          {t(
                            "summary.list.failure",
                            "Generation failed. You can delete and try again."
                          )}
                        </span>
                      </div>
                    )}

                    {summary.status === GenerationStatus.PROCESSING && (
                      <div className="w-full">
                        <ProgressStrip />
                      </div>
                    )}
                    {summary.status === GenerationStatus.PENDING && (
                      <div className="w-full">
                        <QueuedStrip />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          <GenerateContentComponent
            title={t("summary.generate.title", "Create a Summary")}
            description={t(
              "summary.generate.description",
              "Create a Summary to summarize key points and generate a mind map for better understanding."
            )}
            buttonLabel={t("summary.generate.button", "Generate")}
            onClick={handleCreateSummary}
            dir={direction}
            disabled={anyActive}
          />
        </motion.div>
      </ScrollArea>

      <SummaryModal
        open={modalOpen}
        onClose={handleClosingModalSummaryCreate}
        workspaceId={workspaceId}
        anyActive={anyActive}
      />
    </div>
  );
}
