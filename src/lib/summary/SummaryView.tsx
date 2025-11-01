import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "reactflow/dist/style.css";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Edge, Node, Position, ReactFlowProvider } from "reactflow";
import FlowChart from "./Flowchart";
import { MindMap, MindMapNode, SummaryViewProps } from "./Summary";

export function SummaryView({ summary, onClose }: SummaryViewProps) {
  const { t } = useTranslation();
  const direction = summary.language == "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";
  if (!summary.payload) {
    return (
      <div className="p-6" dir={direction}>
        <p className="text-gray-700">
          {t("summary.view.noData", "No summary data available.")}
        </p>
        <Button className="mt-4" onClick={onClose}>
          {t("common.back", "Back")}
        </Button>
      </div>
    );
  }

  const { nodes, edges } = mapMindMapRootToFlowData(summary.payload.mind_map);

  return (
    <Card
      className="flex flex-col gap-4 px-2 md:px-6 w-full min-h-[600px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 overflow-visible"
      dir={direction}
    >
      <div className="flex flex-col items-start w-full max-w-5xl mx-auto gap-4">
        <div
          className={cn(
            "flex group items-center text-zinc-400/70 cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 drop-shadow-sm hover:text-zinc-700 dark:hover:text-zinc-200 rounded-2xl py-2 px-3 transition-all ease-linear duration-100",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
          onClick={onClose}
        >
          <ArrowLeft
            className={cn(
              "w-4 h-4 transition-all ease-out duration-200",
              isRTL
                ? "ml-2 group-hover:translate-x-1"
                : "mr-2 group-hover:-translate-x-1"
            )}
          />
          <span className="text-sm">{t("common.back", "Back")}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {summary.payload.title}
        </h2>
        <p className="text-gray-600 mb-2">{summary.payload.overview}</p>
      </div>
      <div className="flex flex-col w-full max-w-5xl mx-auto mt-2">
        <div className="font-semibold mb-1">
          {t("summary.view.mainPoints", "Main Points:")}
        </div>
        <ul className="mb-4 list-disc list-inside text-gray-700 px-2">
          {summary.payload.main_points.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-2 flex flex-col">
        <div className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
          {t("summary.view.mindMap", "Mind Map")}
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
