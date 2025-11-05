import "reactflow/dist/style.css";
import {
  ArrowLeft,
  Target,
  Book,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
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
        <div className="w-full pb-8" dir={direction}>
          {/* Header Section - Clean, No Background */}
          <div className="px-6 pt-6 pb-8 mb-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Back Button */}
              <div
                className={cn(
                  "flex group items-center text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-all w-fit",
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
                <span className="text-sm font-medium">
                  {t("common.back", "Back")}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {summary.payload.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {summary.payload.overview}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            {/* Main Points - Feature Section */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("summary.view.mainPoints", "Key Insights")}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {summary.payload.main_points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900/60 dark:to-zinc-950/40 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mind Map Section with React Flow - Second Position */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("summary.view.mindMap", "Mind Map")}
                </h2>
              </div>

              <div className="bg-white dark:bg-zinc-900/80 rounded-3xl p-2 shadow-lg border border-zinc-200 dark:border-zinc-800">
                <div
                  className="w-full relative bg-gradient-to-br from-zinc-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl overflow-hidden react-flow-hide-attribution"
                  style={{ height: 500 }}
                >
                  <ReactFlowProvider>
                    <FlowChart initialNodes={nodes} initialEdges={edges} />
                  </ReactFlowProvider>
                </div>
              </div>
            </section>

            {/* Structure Section - Timeline Style */}
            {summary.payload.structure &&
              summary.payload.structure.length > 0 && (
                <section className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t("summary.view.structure", "Content Structure")}
                    </h2>
                  </div>

                  <div className="relative space-y-6">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-300 via-zinc-200 to-transparent dark:from-zinc-700 dark:via-zinc-800"></div>

                    {summary.payload.structure.map((item, idx) => (
                      <div key={idx} className="relative pl-12">
                        {/* Timeline Dot */}
                        <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-600 shadow-sm"></div>

                        <div className="bg-white dark:bg-zinc-900/60 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-300">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            {item.section}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            {item.content}
                          </p>
                          {item.sub_points && item.sub_points.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                              {item.sub_points.map((point, pointIdx) => (
                                <div
                                  key={pointIdx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {point}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Key Concepts - Card Grid */}
            {summary.payload.key_concepts &&
              summary.payload.key_concepts.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t("summary.view.keyConcepts", "Core Concepts")}
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {summary.payload.key_concepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-gradient-to-br from-zinc-50 to-gray-100 dark:from-zinc-900/40 dark:to-zinc-950/60 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {idx + 1}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-8">
                          {concept.concept}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                          {concept.definition}
                        </p>
                        {concept.importance && (
                          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                              💡 {concept.importance}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Study Tips - Compact List */}
            {summary.payload.study_tips &&
              summary.payload.study_tips.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t("summary.view.studyTips", "Study Tips")}
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {summary.payload.study_tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-zinc-50 to-gray-100 dark:from-zinc-900/40 dark:to-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-600 dark:bg-zinc-700 text-white text-sm font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Practical Applications - Feature Grid */}
            {summary.payload.practical_applications &&
              summary.payload.practical_applications.length > 0 && (
                <section className="pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t(
                        "summary.view.practicalApplications",
                        "Real-World Applications"
                      )}
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {summary.payload.practical_applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white dark:bg-zinc-900/60 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-zinc-500/10 to-gray-500/10 dark:from-zinc-500/20 dark:to-gray-500/20 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {app}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </div>
      </ScrollArea>

      {/* CSS to hide React Flow attribution */}
      <style>{`
        .react-flow-hide-attribution .react-flow__panel.react-flow__attribution {
          display: none !important;
        }
        .react-flow__attribution {
          display: none !important;
        }
      `}</style>
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
