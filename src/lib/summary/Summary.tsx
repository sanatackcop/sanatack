import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactFlow, {
  Node,
  Edge,
  ReactFlowProvider,
  NodeProps,
  Position,
  ReactFlowInstance,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  createNewSummaryApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, ArrowLeft, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GenerationStatus } from "../types";
import {
  getErrorMessage,
  ProgressStrip,
  QueuedStrip,
  StatusBadge,
} from "@/pages/dashboard/utils";
import { toast } from "sonner";

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

// ---------- Node Component ----------
function KeyPointNode({ data }: NodeProps<any>) {
  return (
    <div className="bg-blue-100 border-2 border-blue-500 text-blue-900 rounded-lg p-4 min-w-[180px] max-w-xs whitespace-normal shadow-lg select-none font-medium">
      {data.label}
    </div>
  );
}

const nodeTypes = {
  keyPoint: KeyPointNode,
};

// ---------- Mapping Function ----------
function mapMindMapRootToFlowData(mindMap: MindMap): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let idCounter = 0;
  const horizontalSpace = 350;
  const verticalSpace = 120;
  const rootId = "root-node";

  function getTreeHeight(node: MindMapNode): number {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((sum, child) => sum + getTreeHeight(child), 0);
  }

  const totalHeight = mindMap.nodes.reduce(
    (sum, node) => sum + getTreeHeight(node),
    0
  );

  nodes.push({
    id: rootId,
    data: { label: mindMap.root },
    position: { x: 0, y: (totalHeight * verticalSpace) / 2 },
    type: "keyPoint",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  function recurse(
    node: MindMapNode,
    level: number,
    offsetY: number,
    parentId: string
  ): number {
    const nodeId = node.id || `node-${idCounter++}`;
    const posX = level * horizontalSpace;
    const childHeight = node.children
      ? node.children.reduce((sum, child) => sum + getTreeHeight(child), 0)
      : 1;
    const posY = offsetY + (childHeight * verticalSpace) / 2;

    nodes.push({
      id: nodeId,
      data: { label: node.label },
      position: { x: posX, y: posY },
      type: "keyPoint",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // Let React Flow handle all edges; no custom styling or type
    edges.push({
      id: `e${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
    });

    let currentOffset = offsetY;
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        const childTreeHeight = getTreeHeight(child);
        recurse(child, level + 1, currentOffset, nodeId);
        currentOffset += childTreeHeight * verticalSpace;
      });
    }
    return childHeight;
  }

  let currentOffset = 0;
  if (mindMap.nodes && mindMap.nodes.length > 0) {
    mindMap.nodes.forEach((topNode) => {
      const treeHeight = getTreeHeight(topNode);
      recurse(topNode, 1, currentOffset, rootId);
      currentOffset += treeHeight * verticalSpace;
    });
  }

  return { nodes, edges };
}

interface FlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

function FlowChart({ initialNodes, initialEdges }: FlowChartProps) {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
    setTimeout(() => {
      instance.fitView({ padding: 0.2, duration: 200 });
    }, 50);
  }, []);

  useEffect(() => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.2, duration: 200 });
    }
  }, [rfInstance]);

  const initialNodes2 = initialNodes.map((node) => {
    const { type, ...fil } = node;
    return fil;
  });

  return (
    <ReactFlow
      nodes={initialNodes2}
      edges={initialEdges}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
      minZoom={0.1}
      maxZoom={2}
      nodesConnectable={false}
      nodesDraggable={true}
      zoomOnScroll={true}
      panOnScroll={false}
    >
      <Background color="#94a3b8" gap={20} />
      <Controls />
    </ReactFlow>
  );
}

export function SummaryList({ workspaceId }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation();

  const createNewSummary = async () => {
    setGenerating(true);
    try {
      await createNewSummaryApi({ id: workspaceId });
      setRefetch(!refetch);
    } catch (err) {
      const fallbackMessage = t(
        "dashboard.errors.loadSpaces",
        "Failed Creating Summary."
      );
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, {
        closeButton: true,
      });
      console.error("Failed Creating Summary: ", err);
    } finally {
      setGenerating(false);
    }
  };

  const anyActive = useMemo(
    () =>
      summaries.some(
        (x) => x.status === "pending" || x.status === "processing"
      ),
    [summaries]
  );

  useEffect(() => {
    setLoading(true);
    getWorkSpaceContent(workspaceId).then((data: any) => {
      setSummaries(data.summaries ?? []);
      setLoading(false);
    });
  }, [workspaceId, refetch]);

  if (selectedSummary) {
    return (
      <div className="flex-1 min-h-0">
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
        >
          <h3 className="px-2 text-sm font-medium text-gray-700">
            {t("common.mySummary", "Summaries")}
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
                            {summary.payload?.title ?? "Generating summary..."}
                          </h3>
                          <StatusBadge status={summary.status} />
                        </div>
                      </div>
                    </div>

                    {failed && (
                      <div className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          Generation failed. You can delete and try again.
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
          <Card className="relative z-0 py-2 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-zinc-50/60 dark:from-zinc-950/40 dark:to-zinc-900/40 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-200">
            <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
              <div className="max-w-[65%]">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                  {t("summary.createTitle", "Create a Summary")}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {t(
                    "common.createFlashCardDescription",
                    "Create a Summary to summarize key points and generate a mind map for better understanding."
                  )}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  disabled={generating || anyActive}
                  className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
                  onClick={createNewSummary}
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  {t("common.generate", "Generate")}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </ScrollArea>
    </div>
  );
}

// ---------- SummaryView Component ----------
export function SummaryView({ summary, onClose }: SummaryViewProps) {
  if (!summary.payload) {
    return (
      <div className="p-6">
        <p className="text-gray-700">No summary data available.</p>
        <Button className="mt-4" onClick={onClose}>
          Back
        </Button>
      </div>
    );
  }

  const { nodes, edges } = mapMindMapRootToFlowData(summary.payload.mind_map);

  return (
    <Card className="flex flex-col gap-4 px-2 md:px-6 w-full min-h-[600px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 overflow-visible">
      <div className="flex flex-col items-start w-full max-w-5xl mx-auto gap-4">
        <div
          className="flex group items-center text-zinc-400/70 cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 drop-shadow-sm hover:text-zinc-700 dark:hover:text-zinc-200 rounded-2xl py-2 px-3 transition-all ease-linear duration-100"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all ease-out duration-200" />
          <span className="text-sm">Back</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {summary.payload.title}
        </h2>
        <p className="text-gray-600 mb-2">{summary.payload.overview}</p>
      </div>
      <div className="flex flex-col w-full max-w-5xl mx-auto mt-2">
        <div className="font-semibold mb-1">Main Points:</div>
        <ul className="mb-4 list-disc list-inside text-gray-700 px-2">
          {summary.payload.main_points.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-2 flex flex-col">
        <div className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
          Mind Map
        </div>
        <div
          className="w-full relative bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800"
          style={{ height: 500 }}
        >
          <ReactFlowProvider>
            <FlowChart initialNodes={nodes} initialEdges={edges} />
          </ReactFlowProvider>
        </div>
      </div>
    </Card>
  );
}
