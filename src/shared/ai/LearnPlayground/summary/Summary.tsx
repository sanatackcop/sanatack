import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactFlow, { Node, Edge, ReactFlowProvider, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { getWorkSpaceContent } from "@/utils/_apis/learnPlayground-api";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MindMapNode {
  id?: string;
  label: string;
  children?: MindMapNode[];
}

export interface Summary {
  title: string;
  overview: string;
  main_points: string[];
  mind_map: MindMapNode;
}

export interface SummaryListProps {
  worksapceId: string;
}

export interface SummaryViewProps {
  summary: Summary;
  onClose: () => void;
}

function KeyPointNode({ data }: NodeProps<any>) {
  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-900 rounded-lg p-3 min-w-[220px] max-w-xs whitespace-normal shadow">
      {data.label}
    </div>
  );
}

// Static demo mind map with key points as separate nodes, fully wired
function mapTreeToFlowDataWithKeyPointsDemo(keyPoints: string[]) {
  const nodes: Node[] = [
    {
      id: "root",
      data: { label: "Monte Carlo for Trading (Jesse)" },
      position: { x: 0, y: 100 },
    },
    {
      id: "core",
      data: { label: "Core Concepts" },
      position: { x: 250, y: 40 },
    },
    { id: "methods", data: { label: "Methods" }, position: { x: 250, y: 140 } },
    {
      id: "config",
      data: { label: "Configuration" },
      position: { x: 250, y: 240 },
    },

    {
      id: "kp1",
      data: { label: keyPoints[0] || "Key Point 1" },
      position: { x: 500, y: 40 },
      type: "keyPoint",
    },
    {
      id: "kp2",
      data: { label: keyPoints[1] || "Key Point 2" },
      position: { x: 500, y: 140 },
      type: "keyPoint",
    },
    {
      id: "kp3",
      data: { label: keyPoints[2] || "Key Point 3" },
      position: { x: 500, y: 240 },
      type: "keyPoint",
    },
  ];

  const edges: Edge[] = [
    { id: "root-core", source: "root", target: "core" },
    { id: "root-methods", source: "root", target: "methods" },
    { id: "root-config", source: "root", target: "config" },

    { id: "core-kp1", source: "core", target: "kp1" },
    { id: "methods-kp2", source: "methods", target: "kp2" },
    { id: "config-kp3", source: "config", target: "kp3" },
  ];

  return { nodes, edges };
}

export function SummaryList({ worksapceId }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  useEffect(() => {
    setLoading(true);
    getWorkSpaceContent(worksapceId).then((data: any) => {
      setSummaries(data.summaries ?? []);
      setLoading(false);
    });
  }, [worksapceId]);

  if (selectedSummary) {
    return (
      <>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <SummaryView
              summary={selectedSummary}
              onClose={() => setSelectedSummary(null)}
            />
          </ScrollArea>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col px-6 py-6 gap-4 w-full">
      <h2 className="text-xl font-semibold mb-2">My Summaries</h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 h-32 animate-pulse" />
          ))}
        </div>
      ) : summaries.length === 0 ? (
        <p>No summaries available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {summaries.map((summary, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedSummary(summary)}
              className="cursor-pointer hover:bg-gray-50 border rounded-xl p-5 flex flex-col"
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
    </div>
  );
}

export function SummaryView({ summary, onClose }: SummaryViewProps) {
  // For demo: use static demo mind map irrespective of summary data
  const { nodes, edges } = mapTreeToFlowDataWithKeyPointsDemo(
    summary.main_points
  );

  return (
    <ReactFlowProvider>
      <Card className="flex flex-col gap-4 px-2 py-8 md:px-6 md:py-10 w-full min-h-[32rem] bg-white border-none overflow-visible">
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
          <div className="w-full overflow-x-auto border rounded-xl bg-gray-50 p-2">
            <div style={{ minWidth: 600, height: 420 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={{ keyPoint: KeyPointNode }}
                fitView
                zoomOnScroll
                panOnScroll
                style={{ width: "100%", height: 400 }}
              />
            </div>
          </div>
        </div>
      </Card>
    </ReactFlowProvider>
  );
}
