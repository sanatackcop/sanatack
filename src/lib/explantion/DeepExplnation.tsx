import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { GenerationStatus } from "../types";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import {
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import ExplanationSections from "./ExplanationSection";
import { useTranslation } from "react-i18next";
import GenerateContentComponent from "@/shared/workspaces/Generate";
import { cn } from "@/lib/utils";
import ExplanationModal from "./ExplanationModal";

export type Explanation = {
  id: string;
  created_at: string;
  updated_at: string;
  language: "ar" | "en";
  status: "pending" | "processing" | "failed" | "completed";
  payload: ExplanationPayload | null;
  failureReason?: string | null;
};

export type ExplanationPayload = {
  title: string;
  introduction: string;
  main_content: {
    content: string;
    section: string;
    examples?: string[];
    key_points?: string[];
    connections?: string[];
    detailed_breakdown?: string;
    practical_significance?: string;
  }[];
  key_takeaways?: string[];
  terminology_explained?: {
    term: string;
    context?: string;
    definition: string;
  }[];
  comprehensive_analysis?: {
    core_themes?: string[];
    detailed_concepts?: {
      concept: string;
      supporting_details?: string[];
      in_depth_explanation?: string;
    }[];
    processes_and_methods?: {
      process: string;
      explanations?: string[];
      detailed_steps?: string[];
    }[];
  };
  practical_applications?: string[];
  mind_map?: unknown;
};

const POLL_MS = 2000;

const toGen = (s: Explanation["status"]): GenerationStatus =>
  s === "pending"
    ? GenerationStatus.PENDING
    : s === "processing"
    ? GenerationStatus.PROCESSING
    : s === "failed"
    ? GenerationStatus.FAILED
    : GenerationStatus.COMPLETED;

export default function MindMap({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<Explanation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null); // null => show LIST first
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const isRTL = direction === "rtl";

  const handleCreateExplanation = useCallback(() => {
    setModalOpen(true);
  }, []);

  function handleClosingModalExplanationCreate(created?: boolean) {
    setModalOpen(false);
    if (created) setRefresh(!refresh);
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const content = (await getWorkSpaceContent(workspaceId)) as {
        explanations?: Explanation[];
      };
      const list = (content.explanations ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      setItems(list);
      setError(null);
      // IMPORTANT: do NOT auto-select anything; list first like FlashcardsList
    } catch (err) {
      console.error("Failed to load explanations:", err);
      setItems([]);
      setError("explanations.fetchError");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  const anyActive = useMemo(
    () =>
      items.some((x) => x.status === "pending" || x.status === "processing"),
    [items]
  );

  useEffect(() => {
    if (!anyActive) return;
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [anyActive, load]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6 px-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-[480px] w-full rounded-xl" />
      </div>
    );
  }

  const active = items.find((x) => x.id === activeId) ?? null;

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        {!active ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="py-4 flex flex-col rounded-3xl justify-between space-y-3"
            dir={direction}
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-white mx-6">
              {t("explanations.list.title", "My Explanations")}
            </h3>

            {error && (
              <div className="text-sm text-destructive mx-6">
                {t(error, "Failed to fetch explanations. Please try again.")}
              </div>
            )}

            {items.map((it) => {
              const disabled =
                it.status === "pending" || it.status === "processing";
              const isFailed = it.status === "failed";
              const createdLabel = t("explanations.list.createdAt", {
                date: new Date(it.created_at).toLocaleString(),
                defaultValue: "Created {{date}}",
              });
              return (
                <Card
                  key={it.id}
                  role="button"
                  aria-disabled={disabled}
                  aria-busy={disabled}
                  onClick={() =>
                    it.status === "completed" && setActiveId(it.id)
                  }
                  className={`group relative overflow-hidden px-6 py-5 flex flex-col rounded-2xl justify-center shadow-sm border transition-all cursor-pointer
                        ${
                          isFailed
                            ? "bg-red-50/50 border-red-200 hover:border-red-300"
                            : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 border-gray-200/60 hover:border-gray-300/80"
                        }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {it.payload?.title ||
                            t("explanations.list.untitled", "Explanation")}
                        </h3>
                        <StatusBadge status={toGen(it.status)} />
                      </div>
                      <div className="text-xs text-gray-500">
                        {createdLabel}
                      </div>
                    </div>
                  </div>

                  {isFailed && (
                    <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {it.failureReason ||
                          t(
                            "explanations.list.failure",
                            "Generation failed. You can try again."
                          )}
                      </span>
                    </div>
                  )}

                  {it.status === "processing" && <ProgressStrip />}
                  {it.status === "pending" && <QueuedStrip />}
                </Card>
              );
            })}

            <GenerateContentComponent
              title={t("explanations.generate.title", "Deep Explanation")}
              description={t(
                "explanations.generate.description",
                "Break down complex topics into structured, accessible insights."
              )}
              buttonLabel={t("explanations.generate.button", "Generate")}
              onClick={handleCreateExplanation}
              dir={direction}
            />
            <ExplanationModal
              open={modalOpen}
              onClose={handleClosingModalExplanationCreate}
              workspaceId={workspaceId}
              anyActive={anyActive}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`detail-${active.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col w-full"
          >
            <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0">
              <div
                className={cn(
                  "flex group items-center text-gray-400/50 cursor-pointer hover:bg-gray-50/50 rounded-2xl py-2 px-3 transition-all",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
                onClick={() => setActiveId(null)}
              >
                <ArrowLeft
                  className={cn(
                    "w-4 h-4 transition",
                    isRTL
                      ? "ml-2 group-hover:translate-x-1"
                      : "mr-2 group-hover:-translate-x-1"
                  )}
                />
                <span className="text-sm">{t("common.back", "Back")}</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-white">
              <ScrollArea className="h-full">
                {active.status !== "completed" ? (
                  <div className="space-y-6 px-6">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Card className="px-6 py-4 flex items-center gap-2 border border-amber-200 bg-amber-50 text-amber-800">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        {active.status === "pending"
                          ? t("explanations.detail.queued", "Queued…")
                          : t("explanations.detail.processing", "Processing…")}
                      </span>
                    </Card>
                    <Skeleton className="h-[480px] w-full rounded-xl" />
                  </div>
                ) : (
                  <div className="px-6 mb-4 flex flex-col rounded-3xl space-y-3">
                    <div className="px-6">
                      <ScrollArea className="h-full">
                        {active.payload ? (
                          <ExplanationSections
                            explanation={active.payload}
                            language={active.language}
                          />
                        ) : (
                          <Card className="p-4">
                            <div className="text-sm text-gray-600">
                              {t(
                                "explanations.detail.noContent",
                                "No explanation content available."
                              )}
                            </div>
                          </Card>
                        )}
                      </ScrollArea>
                    </div>

                    {/* If/when you want the mind-map back, uncomment below */}
                    {/* {active.payload?.mind_map && (
                        <Card className="mx-6 p-4 h-[32rem] border border-gray-200">
                          <ReactFlowProvider>
                            <ReactFlow
                              {...buildMindMapGraph(active.payload.mind_map)}
                              fitView
                              minZoom={0.25}
                            >
                              <MiniMap />
                              <Controls />
                              <Background gap={16} color="#f3f4f6" />
                            </ReactFlow>
                          </ReactFlowProvider>
                        </Card>
                      )} */}
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
}
