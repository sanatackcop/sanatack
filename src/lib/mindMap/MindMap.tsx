import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings2, RefreshCcw } from "lucide-react";
import {
  createNewDeepExplanationApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { motion } from "framer-motion";

interface MindMapNodeDto {
  id: string;
  label: string;
  children?: MindMapNodeDto[];
}

interface ExplanationMindMapDto {
  root: string;
  nodes: MindMapNodeDto[];
}

interface ExplanationDto {
  title: string;
  introduction: string;
  main_content?: Array<{
    section: string;
    content: string;
    detailed_breakdown?: string;
    examples?: string[];
    key_points?: string[];
    practical_significance?: string;
  }>;
  comprehensive_analysis?: {
    core_themes?: string[];
    detailed_concepts?: Array<{
      concept: string;
      in_depth_explanation: string;
      supporting_details?: string[];
    }>;
    processes_and_methods?: Array<{
      process: string;
      detailed_steps: string[];
      explanations?: string[];
    }>;
  };
  key_takeaways?: string[];
  practical_applications?: string[];
  study_tips?: string[];
  mind_map?: ExplanationMindMapDto | null;
}

interface MindMapProps {
  workspaceId: string;
}

const VERTICAL_SPACING = 140;
const HORIZONTAL_SPACING = 220;

const buildMindMapGraph = (mindMap?: ExplanationMindMapDto | null) => {
  if (!mindMap || (!mindMap.root && !mindMap.nodes?.length)) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yCursor = 0;

  nodes.push({
    id: "root",
    data: { label: mindMap.root || "Root" },
    position: { x: 0, y: 0 },
    type: "input",
  });

  const normaliseId = (rawId: string, fallbackSuffix: string) =>
    rawId && rawId.trim().length ? rawId : `node-${fallbackSuffix}`;

  const walk = (node: MindMapNodeDto, depth: number, parentId: string) => {
    const nodeId = normaliseId(node.id, `${parentId}-${nodes.length}`);
    const position = { x: depth * HORIZONTAL_SPACING, y: yCursor };
    yCursor += VERTICAL_SPACING;

    nodes.push({
      id: nodeId,
      data: { label: node.label },
      position,
      type: depth === 1 ? "default" : undefined,
    });

    edges.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      animated: depth < 2,
    });

    node.children?.forEach((child) => walk(child, depth + 1, nodeId));
  };

  mindMap.nodes?.forEach((child) => walk(child, 1, "root"));

  const minY = nodes.reduce((acc, n) => Math.min(acc, n.position.y), 0);
  if (minY < 0) {
    nodes.forEach((n) => {
      n.position = { ...n.position, y: n.position.y - minY + VERTICAL_SPACING };
    });
  }

  return { nodes, edges };
};

const ExplanationSections = ({
  explanation,
}: {
  explanation: ExplanationDto;
}) => {
  const hasSections =
    explanation.main_content && explanation.main_content.length > 0;
  const hasAnalysis = explanation.comprehensive_analysis;
  const hasTips = explanation.study_tips && explanation.study_tips.length > 0;
  const hasApplications =
    explanation.practical_applications &&
    explanation.practical_applications.length > 0;
  const hasKeyTakeaways =
    explanation.key_takeaways && explanation.key_takeaways.length > 0;

  return (
    <div className="space-y-6 h-full">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {explanation.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {explanation.introduction}
        </p>
      </section>

      {hasSections && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Main Sections</h3>
          {explanation.main_content!.map((section, idx) => (
            <Card key={idx} className="p-5 space-y-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {section.section}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
              {section.detailed_breakdown && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  {section.detailed_breakdown}
                </div>
              )}
              {section.examples && section.examples.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Examples
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {section.examples.map((example, exampleIdx) => (
                      <li key={exampleIdx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.key_points && section.key_points.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Key Points
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {section.key_points.map((point, pointIdx) => (
                      <li key={pointIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.practical_significance && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
                  {section.practical_significance}
                </div>
              )}
            </Card>
          ))}
        </section>
      )}

      {hasAnalysis && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Comprehensive Analysis
          </h3>
          {explanation.comprehensive_analysis?.core_themes && (
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Core Themes</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {explanation.comprehensive_analysis.core_themes.map(
                  (theme, idx) => (
                    <li key={idx}>{theme}</li>
                  )
                )}
              </ul>
            </Card>
          )}
          {explanation.comprehensive_analysis?.detailed_concepts?.map(
            (concept, idx) => (
              <Card key={idx} className="p-4 space-y-2">
                <div className="text-lg font-semibold text-gray-900">
                  {concept.concept}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {concept.in_depth_explanation}
                </p>
                {concept.supporting_details &&
                  concept.supporting_details.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {concept.supporting_details.map((detail, detailIdx) => (
                        <li key={detailIdx}>{detail}</li>
                      ))}
                    </ul>
                  )}
              </Card>
            )
          )}
        </section>
      )}

      {hasApplications && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            Practical Applications
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.practical_applications!.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {hasTips && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Study Tips</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.study_tips!.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {hasKeyTakeaways && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Key Takeaways</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.key_takeaways!.map((takeaway, idx) => (
              <li key={idx}>{takeaway}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const EmptyState = ({
  onGenerate,
  loading,
}: {
  onGenerate: () => Promise<void>;
  loading: boolean;
}) => (
  <Card className="relative z-0 mx-5 px-6 py-10 flex flex-col items-center text-center gap-4 border-2 border-dashed border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
    <h2 className="text-2xl font-semibold text-gray-900">
      Generate a Deep Explanation
    </h2>
    <p className="text-gray-600 max-w-xl">
      Create a comprehensive deep-dive explanation with structured sections, key
      themes, and a mind map overview tailored to your workspace content.
    </p>
    <Button
      onClick={onGenerate}
      disabled={loading}
      className="rounded-2xl px-6 py-3 font-medium shadow-sm"
    >
      {loading ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Settings2 className="mr-2 h-4 w-4" />
          Generate Explanation
        </>
      )}
    </Button>
  </Card>
);

const ExplanationHeader = ({
  onGenerate,
  loading,
}: {
  onGenerate: () => Promise<void>;
  loading: boolean;
}) => (
  <Card className="relative z-0 mx-5 px-6 py-6 flex items-center justify-between border border-gray-200 bg-white shadow-sm">
    <div className="max-w-[70%] space-y-1">
      <h2 className="text-2xl font-semibold text-gray-900">Deep Explanation</h2>
      <p className="text-sm text-gray-600">
        Detailed concept breakdown, comprehensive analysis, and a visual mind
        map for accelerated learning.
      </p>
    </div>
    <Button
      onClick={onGenerate}
      disabled={loading}
      className="rounded-2xl px-6 py-3"
    >
      {loading ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Settings2 className="mr-2 h-4 w-4" />
          Regenerate
        </>
      )}
    </Button>
  </Card>
);

export default function MindMap({ workspaceId }: MindMapProps) {
  const [explanation, setExplanation] = useState<ExplanationDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  const loadExplanation = useCallback(async () => {
    setLoading(true);
    try {
      const content = await getWorkSpaceContent(workspaceId);
      const explanations = content?.explanations ?? [];
      setExplanation(explanations.length ? explanations[0] : null);
    } catch (error) {
      console.error("Failed to load explanation", error);
      setExplanation(null);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      await createNewDeepExplanationApi({ id: workspaceId });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await loadExplanation();
    } catch (error) {
      console.error("Failed to generate explanation", error);
    } finally {
      setGenerating(false);
    }
  }, [workspaceId, loadExplanation]);

  useEffect(() => {
    loadExplanation();
  }, [loadExplanation]);

  const { nodes, edges } = useMemo(
    () => buildMindMapGraph(explanation?.mind_map),
    [explanation]
  );

  if (loading && !explanation) {
    return (
      <div className="space-y-6 px-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-[480px] w-full rounded-xl" />
      </div>
    );
  }

  if (!explanation) {
    return <EmptyState onGenerate={handleGenerate} loading={generating} />;
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
          <div className="px-6">
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <ExplanationSections explanation={explanation} />
              </ScrollArea>
            </div>
          </div>
          {nodes.length > 0 && (
            <Card className="mx-6 p-4 h-[32rem] border border-gray-200">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  minZoom={0.25}
                  nodeTypes={{}}
                  edgeTypes={{}}
                >
                  <MiniMap />
                  <Controls />
                  <Background gap={16} color="#f3f4f6" />
                </ReactFlow>
              </ReactFlowProvider>
            </Card>
          )}
          <ExplanationHeader onGenerate={handleGenerate} loading={generating} />
        </motion.div>
      </ScrollArea>
    </div>
  );
}
