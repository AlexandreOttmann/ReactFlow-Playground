import { useEffect, useCallback, memo, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from './store/useFlowStore';
import { NodeEditor } from './components/NodeEditor';
import { Toolbar } from './components/Toolbar';
import { PerformanceMonitor } from './components/PerformanceMonitor';

// Custom Node Component with performance optimization  
const CustomNode = memo(({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <div className="font-bold text-sm">{data.label}</div>
        {data.description && (
          <div className="text-xs text-gray-500 mt-1">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

// Memoize nodeTypes outside component to prevent recreation
const nodeTypes = {
  default: CustomNode,
};

// Main App Component
export default function App() {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const onNodeClick = useFlowStore((state) => state.onNodeClick);
  const loadFromLocalStorage = useFlowStore((state) => state.loadFromLocalStorage);

  // Load saved workflow on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Memoize nodeColor function to prevent unnecessary re-renders
  const nodeColor = useCallback(() => '#4B5563', []);

  // Memoize default edge options to prevent object recreation
  const defaultEdgeOptions = useMemo(() => ({
    animated: false,
  }), []);

  // Memoize fitView options
  const fitViewOptions = useMemo(() => ({
    padding: 0.2,
  }), []);

  return (
    <div className="w-screen h-screen bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={fitViewOptions}
        attributionPosition="bottom-right"
        // Performance optimizations
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        // Only update on viewport changes when needed
        minZoom={0.1}
        maxZoom={4}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={nodeColor}
          className="bg-gray-100"
        />
      </ReactFlow>

      <Toolbar />
      <NodeEditor />
      <PerformanceMonitor />
    </div>
  );
}