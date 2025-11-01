import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  ReactFlowInstance,
  Background,
  Controls,
} from "reactflow";

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

interface FlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export default function FlowChart({
  initialNodes,
  initialEdges,
}: FlowChartProps) {
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
