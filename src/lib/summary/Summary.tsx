import { useEffect, useState, useCallback, useMemo } from "react";
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
import GenerateContentComponent from "@/shared/workspaces/Generate";
import SummaryModal from "./SummaryModal";
import { SummaryView } from "./SummaryView";

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
  status: GenerationStatus; // "PENDING" | "PROCESSING" | "FAILED" | "COMPLETED"
  payload?: SummaryPayload; // optional when not ready
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

export function SummaryList({ workspaceId }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

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

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getWorkSpaceContent(workspaceId);
        if (!isMounted) return;
        setSummaries(data.summaries ?? []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch summaries:", err);
        setSummaries([]);
        setError("summary.fetchError");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [workspaceId, refresh]);

  if (selectedSummary) {
    return (
      <div className="flex-1 min-h-0" dir={direction}>
        <ScrollArea className="h-full">
          <SummaryView
            summary={selectedSummary}
            onClose={() => setSelectedSummary(null)}
          />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="px-6 mb-4 flex flex-col rounded-3xl justify-between space-y-3"
          dir={direction}
        >
          <h3 className="px-2 text-sm font-medium text-gray-700 dark:text-white">
            {t("summary.list.title", "Summaries")}
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 h-32 animate-pulse bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive px-2">
              {t(error, "Failed to fetch summaries. Please try again.")}
            </div>
          ) : summaries.length === 0 ? (
            <></>
          ) : (
            <div className="flex flex-col gap-4">
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
                      completed &&
                      summary.payload &&
                      setSelectedSummary(summary)
                    }
                    className={`group relative overflow-hidden px-6 py-5 flex flex-col rounded-2xl justify-center transition-all duration-200 cursor-pointer
        ${
          failed
            ? "bg-red-50/50 border-red-200 hover:border-red-300"
            : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 border-gray-200/60 hover:border-gray-300/80"
        }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {summary.payload?.title ??
                              t(
                                "summary.list.generating",
                                "Generating summary..."
                              )}
                          </h3>
                          <StatusBadge status={summary.status} />
                        </div>
                      </div>
                    </div>

                    {failed && (
                      <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {summary.failureReason ||
                            t(
                              "summary.list.failure",
                              "Generation failed. You can delete and try again."
                            )}
                        </span>
                      </div>
                    )}

                    {summary.status === GenerationStatus.PROCESSING && (
                      <ProgressStrip />
                    )}
                    {summary.status === GenerationStatus.PENDING && (
                      <QueuedStrip />
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
        <GenerateContentComponent
          title={t("summary.generate.title", "Create a Summary")}
          description={t(
            "summary.generate.description",
            "Create a Summary to summarize key points and generate a mind map for better understanding."
          )}
          buttonLabel={t("summary.generate.button", "Generate")}
          onClick={handleCreateSummary}
          dir={direction}
        />
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
