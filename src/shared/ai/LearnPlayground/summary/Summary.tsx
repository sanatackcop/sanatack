import { useEffect, useState, useCallback } from "react";
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
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  createNewSummaryApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export interface MindMapNode {
  id?: string;
  label: string;
  children?: MindMapNode[];
}

export interface MindMap {
  root: string;
  nodes: MindMapNode[];
}

export interface Summary {
  title: string;
  overview: string;
  main_points: string[];
  mind_map: MindMap;
}

export interface SummaryListProps {
  worksapceId: string;
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
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
  }, [nodes, edges]);

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
  }, [rfInstance, nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
      minZoom={0.1}
      maxZoom={2}
      elementsSelectable={true}
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

// ---------- SummaryList Component ----------
export function SummaryList({ worksapceId }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const { t } = useTranslation();

  const createNewSummary = async () => {
    await createNewSummaryApi({ id: worksapceId });
  };

  useEffect(() => {
    setLoading(true);
    getWorkSpaceContent(worksapceId).then((data: any) => {
      setSummaries(data.summaries ?? []);
      setLoading(false);
    });
  }, [worksapceId]);

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
            {t("common.myFlashcards", "My Summary")}
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 h-32 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : summaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No summaries yet. Create your first one!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {summaries.map((summary, idx) => (
                <Card
                  key={idx}
                  onClick={() => setSelectedSummary(summary)}
                  className="group relative px-6 py-5 flex flex-col rounded-2xl justify-center hover:bg-gradient-to-r hover:from-gray-50 ease-in
                                         hover:to-gray-100/80 cursor-transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-lg text-gray-900">
                      {summary.title}
                    </h4>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <Card className="relative z-0 py-2  flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
            <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
              <div className="max-w-[65%]">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                  Create a Summary
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(
                    "common.createFlashCardDescription",
                    "Create a flashcard set with custom settings and personalization"
                  )}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
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
  const { nodes, edges } = mapMindMapRootToFlowData(summary.mind_map);

  return (
    <Card className="flex flex-col gap-4 px-2 md:px-6  w-full min-h-[600px] border-none overflow-visible">
      <div className="flex flex-col items-start w-full max-w-5xl mx-auto gap-4">
        <div
          className="flex group items-center text-gray-400/50 cursor-pointer hover:bg-gray-50/50 drop-shadow-sm hover:text-zinc-700 rounded-2xl py-2 px-3 transition-all ease-linear duration-100"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all ease-out duration-200" />
          <span className="text-sm">Back</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{summary.title}</h2>
        <p className="text-gray-600 mb-2">{summary.overview}</p>
      </div>
      <div className="flex flex-col w-full max-w-5xl mx-auto mt-2">
        <div className="font-semibold mb-1">Main Points:</div>
        <ul className="mb-4 list-disc list-inside text-gray-700 px-2">
          {summary.main_points.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-2 flex flex-col">
        <div className="font-semibold mb-2">Mind Map</div>
        <div className="w-full relative" style={{ height: 500 }}>
          <ReactFlowProvider>
            <FlowChart initialNodes={nodes} initialEdges={edges} />
          </ReactFlowProvider>
        </div>
      </div>
    </Card>
  );
}
