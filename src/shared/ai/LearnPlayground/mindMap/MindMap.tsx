import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createNewDeepExplanationApi,
  getWorkSpaceContent,
} from "@/utils/_apis/learnPlayground-api";
import { Settings2 } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Monte Carlo Simulations for Backtest Robustness" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "Motivation" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Monte Carlo Methods" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    data: { label: "Configuration" },
    position: { x: 100, y: 200 },
  },
  {
    id: "5",
    data: { label: "Running Simulations" },
    position: { x: 400, y: 200 },
  },
  {
    id: "6",
    data: { label: "Interpretation" },
    position: { x: 100, y: 300 },
  },
  {
    id: "7",
    data: { label: "Decision Making" },
    position: { x: 400, y: 300 },
  },
  {
    id: "8",
    data: { label: "Recommendations" },
    position: { x: 250, y: 400 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e1-4", source: "1", target: "4", animated: true },
  { id: "e1-5", source: "1", target: "5", animated: true },
  { id: "e1-6", source: "1", target: "6", animated: true },
  { id: "e1-7", source: "1", target: "7", animated: true },
  { id: "e1-8", source: "1", target: "8", animated: true },
];

export default function MindMap({ workspaceId }: { workspaceId: string }) {
  const [mindMaps, setMindMaps] = useState<any>();
  const [nodes, ,] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const createNewMindMap = async () => {
    await createNewDeepExplanationApi({ id: workspaceId });
    getExplanation(); // refresh after creating
  };

  const getExplanation = async () => {
    const getMindMaps = await getWorkSpaceContent(workspaceId);
    setMindMaps(getMindMaps.explanation);
  };

  useEffect(() => {
    getExplanation();
  }, []);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <>
      <div>
        {mindMaps?.map((min: any) => (
          <h1 key={min.id}>{min.title}</h1>
        ))}
      </div>

      <Card className="relative z-0 mx-5 px-4 py-2 h-[50rem] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
        <div className="relative z-10 flex items-start justify-between mx-2 px-4 py-6">
          <div className="max-w-[65%]">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Create Deep Mind Map
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create quiz sets with preferred question types, difficulty, and
              more.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
              onClick={createNewMindMap}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="flex-grow">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              fitView
              attributionPosition="top-right"
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </Card>
    </>
  );
}
