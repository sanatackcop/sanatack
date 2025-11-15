import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
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
import useGenerationNotifications from "@/hooks/useGenerationNotifications";

export type Explanation = {
  id: string;
  created_at: string;
  updated_at: string;
  language: "ar" | "en";
  status: GenerationStatus;
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

export default function MindMap({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<Explanation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
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
  }, [load, refresh]);

  const anyActive = useMemo(
    () =>
      items.some((x) => x.status === "pending" || x.status === "processing"),
    [items]
  );

  useGenerationNotifications(items, {
    entity: "explanation",
    getName: (item) => item.payload?.title,
  });

  useEffect(() => {
    if (!anyActive) return;
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [anyActive, load]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6 px-6">
        <Skeleton className="h-16 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900/60" />
        <Skeleton className="h-[480px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900/60" />
      </div>
    );
  }

  const active = items.find((x) => x.id === activeId) ?? null;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        {!active ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            dir={isRTL ? "rtl" : "ltr"}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 py-4 flex flex-col rounded-3xl justify-between space-y-3">
              <h3 className="px-2 text-sm font-medium text-gray-700 dark:text-white">
                {t("explanations.list.title", "My Explanations")}
              </h3>

              {error && (
                <div className="text-sm text-destructive dark:text-red-400 px-2">
                  {t(error, "Failed to fetch explanations. Please try again.")}
                </div>
              )}

              {items.length === 0 ? (
                <></>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => {
                    const disabled =
                      it.status === "pending" || it.status === "processing";
                    const isFailed = it.status === "failed";
                    const completed = it.status === "completed";
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
                          !disabled &&
                          !isFailed &&
                          completed &&
                          setActiveId(it.id)
                        }
                        className={`group relative overflow-hidden px-6 py-5 flex flex-col rounded-2xl justify-center shadow-sm border transition-all duration-200 cursor-pointer ${
                          isFailed
                            ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800"
                            : "bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:border-gray-300/80 dark:hover:border-zinc-700"
                        } ${disabled ? "pointer-events-auto" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate max-w-[50vw]">
                                {it.payload?.title ||
                                  t(
                                    "explanations.list.untitled",
                                    "Explanation"
                                  )}
                              </h3>
                              <StatusBadge status={it.status} isRTL={isRTL} />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {createdLabel}
                            </div>
                          </div>
                        </div>

                        {isFailed && (
                          <div className="mt-3 w-full rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-3 py-2 text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {t(
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
                </div>
              )}
            </div>

            <GenerateContentComponent
              title={t("explanations.generate.title", "Deep Explanation")}
              description={t(
                "explanations.generate.description",
                "Break down complex topics into structured, accessible insights."
              )}
              buttonLabel={t("explanations.generate.button", "Generate")}
              onClick={handleCreateExplanation}
              dir={direction}
              disabled={anyActive}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`detail-${active.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col w-full"
          >
            <div className="flex items-center gap-4 px-14 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className={cn(
                  "flex items-center rounded-2xl py-2 px-3 transition-all ease-linear duration-100 text-gray-400/50 hover:text-zinc-700 hover:bg-gray-50/50 drop-shadow-sm dark:hover:bg-zinc-100",
                  "group",
                  isRTL ? "flex-row-reverse" : ""
                )}
              >
                <BackIcon
                  className={cn(
                    "w-4 h-4 transition-all ease-out duration-200",
                    isRTL
                      ? "ml-2 group-hover:translate-x-1"
                      : "mr-2 group-hover:-translate-x-1"
                  )}
                />
                <span className="text-sm">{t("common.back", "Back")}</span>
              </button>
            </div>

            <div className="px-6 mb-4">
              {active.status !== "completed" ? (
                <div className="space-y-6">
                  <Skeleton className="h-16 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900/60" />
                  <Card className="px-6 py-4 flex items-center gap-2 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    <span>
                      {active.status === "pending"
                        ? t("explanations.detail.queued", "Queued…")
                        : t("explanations.detail.processing", "Processing…")}
                    </span>
                  </Card>
                  <Skeleton className="h-[480px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900/60" />
                </div>
              ) : active.payload ? (
                <ExplanationSections
                  explanation={active.payload}
                  language={active.language}
                />
              ) : (
                <Card className="p-4 bg-white dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t(
                      "explanations.detail.noContent",
                      "No explanation content available."
                    )}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </ScrollArea>

      <ExplanationModal
        open={modalOpen}
        onClose={handleClosingModalExplanationCreate}
        workspaceId={workspaceId}
        anyActive={anyActive}
      />
    </div>
  );
}
