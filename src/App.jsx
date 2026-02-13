import { useEffect, useCallback, memo } from 'react';
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

// Custom Node Component with performance optimization  
const CustomNode = memo(({ data, id }) => {
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const nodes = useFlowStore((state) => state.nodes);

  const handleClick = useCallback(() => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      setSelectedNode(node);
    }
  }, [id, nodes, setSelectedNode]);

  return (
    <div 
      onClick={handleClick}
      className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
    >
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
  const loadFromLocalStorage = useFlowStore((state) => state.loadFromLocalStorage);

  // Load saved workflow on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="w-screen h-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
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
          nodeColor={(node) => {
            return '#4B5563';
          }}
          className="bg-gray-100"
        />
      </ReactFlow>

      <Toolbar />
      <NodeEditor />
    </div>
  );
}