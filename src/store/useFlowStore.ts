import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';

// Define the node data structure
export interface NodeData {
  label: string;
  description?: string;
  color?: string;
}

// Store state interface
interface FlowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node<NodeData> | null;
  
  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  addNode: (position?: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  toggleNodeVisibility: (nodeId: string) => void;
  clearFlow: () => void;
  
  // Bulk operations
  generateBulkNodes: (count: number) => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  
  // Export/Import
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

const STORAGE_KEY = 'reactflow-workflow';

// Initial state
const initialNodes: Node<NodeData>[] = [
  { 
    id: '1', 
    position: { x: 250, y: 100 }, 
    data: { label: 'Start Node', description: 'This is the starting point' },
    type: 'default'
  },
  { 
    id: '2', 
    position: { x: 250, y: 250 }, 
    data: { label: 'Process Node', description: 'Processing happens here' },
    type: 'default'
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,

  // Handle node changes (position, selection, etc.)
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    // Auto-save on changes
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Handle edge changes
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Handle new connections
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Handle node click - optimized to avoid accessing nodes array in components
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => {
    set({ selectedNode: node });
  },

  // Add a new node
  addNode: (position = { x: Math.random() * 500, y: Math.random() * 500 }) => {
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      position,
      data: { 
        label: `Node ${get().nodes.length + 1}`,
        description: 'New node'
      },
      type: 'default'
    };
    set({ nodes: [...get().nodes, newNode] });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Update node data
  updateNode: (nodeId: string, data: Partial<NodeData>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
    
    // Update selected node if it's the one being edited
    const selectedNode = get().selectedNode;
    if (selectedNode && selectedNode.id === nodeId) {
      set({
        selectedNode: {
          ...selectedNode,
          data: { ...selectedNode.data, ...data }
        }
      });
    }
    
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Delete a node
  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode
    });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Set selected node
  setSelectedNode: (node: Node<NodeData> | null) => {
    set({ selectedNode: node });
  },

  // Toggle node visibility - useful for large node trees
  toggleNodeVisibility: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, hidden: !node.hidden }
          : node
      ),
    });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Clear the entire flow
  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
    });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Generate bulk nodes for performance testing
  generateBulkNodes: (count: number) => {
    const newNodes: Node<NodeData>[] = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = 200;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      newNodes.push({
        id: `bulk-node-${Date.now()}-${i}`,
        position: { 
          x: col * spacing + Math.random() * 50, 
          y: row * spacing + Math.random() * 50 
        },
        data: { 
          label: `Node ${i + 1}`,
          description: `Bulk generated node ${i + 1}`
        },
        type: 'default'
      });
    }

    set({ nodes: [...get().nodes, ...newNodes] });
    setTimeout(() => get().saveToLocalStorage(), 100);
  },

  // Save to localStorage
  saveToLocalStorage: () => {
    try {
      const state = {
        nodes: get().nodes,
        edges: get().edges,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  // Load from localStorage
  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { nodes, edges } = JSON.parse(saved);
        set({ nodes, edges, selectedNode: null });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },

  // Export workflow to JSON
  exportToJSON: () => {
    const state = {
      nodes: get().nodes,
      edges: get().edges,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(state, null, 2);
  },

  // Import workflow from JSON
  importFromJSON: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        set({
          nodes: data.nodes,
          edges: data.edges,
          selectedNode: null,
        });
        setTimeout(() => get().saveToLocalStorage(), 100);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (error) {
      console.error('Failed to import JSON:', error);
      alert('Failed to import workflow. Please check the JSON format.');
    }
  },
}));
