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
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  createNewSummaryApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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

// Custom styled node for React Flow
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

/**
 * Map mind map with separate root label and array of nodes to React Flow nodes and edges.
 */
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

  // Calculate tree size to center properly
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

    // Create edge with explicit configuration
    edges.push({
      id: `e${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: "straight",
      animated: false,
      style: {
        stroke: "#3b82f6",
        strokeWidth: 3,
      },
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

function FlowChart({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
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
      className="bg-white"
      proOptions={{ hideAttribution: true }}
      elementsSelectable={true}
      nodesConnectable={false}
      nodesDraggable={true}
      zoomOnScroll={true}
      panOnScroll={false}
    >
      <svg style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker
            id="arrowclosed"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 12 6 L 0 12 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
      <Background color="#94a3b8" gap={20} />
      <Controls />
    </ReactFlow>
  );
}

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
    <div className="px-6 py-4 mb-4 flex flex-col rounded-3xl justify-between space-y-3">
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
              className="cursor-pointer hover:bg-gray-50 border rounded-xl p-5 flex flex-col transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-lg text-gray-900">
                  {summary.title}
                </h4>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSummary(summary);
                  }}
                >
                  View
                </Button>
              </div>
              <div className="text-gray-600 text-sm">{summary.overview}</div>
            </Card>
          ))}
        </div>
      )}

      <Card className="relative z-0 mx-2 px-4 py-2 h-[25rem] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
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
    </div>
  );
}

export function SummaryView({ summary, onClose }: SummaryViewProps) {
  const { nodes, edges } = mapMindMapRootToFlowData(summary.mind_map);

  console.log("Nodes:", nodes.length, nodes);
  console.log("Edges:", edges.length, edges);

  return (
    <Card className="flex flex-col gap-4 px-2 py-8 md:px-6 md:py-10 w-full min-h-[600px] bg-white border-none overflow-visible">
      <div className="flex flex-col items-start w-full max-w-5xl mx-auto gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-xl"
          type="button"
        >
          Back to Summaries
        </Button>
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
        <div className="text-sm text-gray-600 mb-2">
          Nodes: {nodes.length}, Edges: {edges.length}
        </div>

        <div
          className="w-full border-2 rounded-xl bg-white relative"
          style={{ height: 700 }}
        >
          <ReactFlowProvider>
            <FlowChart initialNodes={nodes} initialEdges={edges} />
          </ReactFlowProvider>
        </div>
      </div>
    </Card>
  );
}
