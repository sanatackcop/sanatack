import "reactflow/dist/style.css";
import { ArrowLeft, BookOpen, Lightbulb, Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Edge, Node, Position, ReactFlowProvider } from "reactflow";
import FlowChart from "./Flowchart";
import { MindMap, MindMapNode, SummaryViewProps } from "./Summary";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SummaryView({ summary, onClose }: SummaryViewProps) {
  const { t } = useTranslation();
  const direction = summary.language == "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  if (!summary.payload) {
    return (
      <div className="p-6 space-y-4" dir={direction}>
        <div
          className={cn(
            "flex group items-center text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50 rounded-2xl py-2 px-3 transition-all w-fit",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
          onClick={onClose}
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
        <p className="text-gray-700 dark:text-gray-300">
          {t("summary.view.noData", "No summary data available.")}
        </p>
      </div>
    );
  }

  const { nodes, edges } = mapMindMapRootToFlowData(summary.payload.mind_map);

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div
          className="flex flex-col gap-6 px-4 md:px-6 w-full pb-6"
          dir={direction}
        >
          {/* Back Button */}
          <div className="flex items-center w-full max-w-5xl mx-auto pt-4">
            <div
              className={cn(
                "flex group items-center text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50 rounded-2xl py-2 px-3 transition-all",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
              onClick={onClose}
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

          {/* Header Section */}
          <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {summary.payload.title}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary.payload.overview}
            </p>
          </div>

          {/* Main Points Section */}
          <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("summary.view.mainPoints", "Main Points")}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-5">
              <ul className="space-y-3 pl-6">
                {summary.payload.main_points.map((pt, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc"
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Structure Section */}
          {summary.payload.structure &&
            summary.payload.structure.length > 0 && (
              <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("summary.view.structure", "Structure")}
                  </h3>
                </div>
                <div className="space-y-4">
                  {summary.payload.structure.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow duration-200"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.section}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.content}
                      </p>
                      {item.sub_points && item.sub_points.length > 0 && (
                        <ul className="space-y-2 pl-6">
                          {item.sub_points.map((point, pointIdx) => (
                            <li
                              key={pointIdx}
                              className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Key Concepts Section */}
          {summary.payload.key_concepts &&
            summary.payload.key_concepts.length > 0 && (
              <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("summary.view.keyConcepts", "Key Concepts")}
                </h3>
                <div className="space-y-4">
                  {summary.payload.key_concepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 space-y-2"
                    >
                      <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200">
                        {concept.concept}
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        {concept.definition}
                      </p>
                      {concept.importance && (
                        <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed italic">
                          {concept.importance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Mind Map Section */}
          <div className="w-full max-w-5xl mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("summary.view.mindMap", "Mind Map")}
              </h3>
            </div>
            <div
              className="w-full relative bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
              style={{ height: 500 }}
            >
              <ReactFlowProvider>
                <FlowChart initialNodes={nodes} initialEdges={edges} />
              </ReactFlowProvider>
            </div>
          </div>

          {/* Study Tips Section */}
          {summary.payload.study_tips &&
            summary.payload.study_tips.length > 0 && (
              <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("summary.view.studyTips", "Study Tips")}
                </h3>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl p-5">
                  <ul className="space-y-3 pl-6">
                    {summary.payload.study_tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-green-800 dark:text-green-200 leading-relaxed list-disc"
                      >
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          {/* Practical Applications Section */}
          {summary.payload.practical_applications &&
            summary.payload.practical_applications.length > 0 && (
              <div className="flex flex-col w-full max-w-5xl mx-auto space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t(
                    "summary.view.practicalApplications",
                    "Practical Applications"
                  )}
                </h3>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-xl p-5">
                  <ul className="space-y-3 pl-6">
                    {summary.payload.practical_applications.map((app, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed list-disc"
                      >
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
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
