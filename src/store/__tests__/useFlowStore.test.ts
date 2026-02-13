import { describe, it, expect, beforeEach } from 'vitest';
import { useFlowStore } from '../useFlowStore';

describe('useFlowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useFlowStore.setState({
      nodes: [],
      edges: [],
      selectedNode: null,
    });
    localStorage.clear();
  });

  describe('Node Operations', () => {
    it('should add a new node', () => {
      const { addNode, nodes } = useFlowStore.getState();
      const initialCount = nodes.length;
      
      addNode({ x: 100, y: 100 });
      
      const updatedNodes = useFlowStore.getState().nodes;
      expect(updatedNodes).toHaveLength(initialCount + 1);
      expect(updatedNodes[updatedNodes.length - 1].position).toEqual({ x: 100, y: 100 });
    });

    it('should update node data', () => {
      const { addNode, updateNode } = useFlowStore.getState();
      
      addNode({ x: 0, y: 0 });
      const nodeId = useFlowStore.getState().nodes[0].id;
      
      updateNode(nodeId, { label: 'Updated Label', description: 'New description' });
      
      const updatedNode = useFlowStore.getState().nodes[0];
      expect(updatedNode.data.label).toBe('Updated Label');
      expect(updatedNode.data.description).toBe('New description');
    });

    it('should delete a node and its connected edges', () => {
      const { deleteNode } = useFlowStore.getState();
      
      // Set up test data directly
      useFlowStore.setState({
        nodes: [
          { id: 'test-1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'default' },
          { id: 'test-2', position: { x: 100, y: 100 }, data: { label: 'Node 2' }, type: 'default' }
        ],
        edges: [{ id: 'e1', source: 'test-1', target: 'test-2' }],
        selectedNode: null
      });
      
      expect(useFlowStore.getState().nodes).toHaveLength(2);
      expect(useFlowStore.getState().edges).toHaveLength(1);
      
      // Delete first node
      deleteNode('test-1');
      
      const state = useFlowStore.getState();
      
      // Node should be deleted
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe('test-2');
      // Edge should also be deleted
      expect(state.edges).toHaveLength(0);
    });
  });

  describe('Bulk Operations', () => {
    it('should generate bulk nodes', () => {
      const { generateBulkNodes } = useFlowStore.getState();
      
      generateBulkNodes(50);
      
      const nodes = useFlowStore.getState().nodes;
      expect(nodes).toHaveLength(50);
      
      // Check that all nodes have positions
      nodes.forEach(node => {
        expect(node.position).toBeDefined();
        expect(typeof node.position.x).toBe('number');
        expect(typeof node.position.y).toBe('number');
      });
    });

    it('should clear all nodes and edges', () => {
      const { addNode, generateBulkNodes, clearFlow, onConnect } = useFlowStore.getState();
      
      // Add some nodes and edges
      addNode({ x: 0, y: 0 });
      addNode({ x: 100, y: 100 });
      generateBulkNodes(10);
      
      const nodes = useFlowStore.getState().nodes;
      onConnect({ source: nodes[0].id, target: nodes[1].id });
      
      expect(useFlowStore.getState().nodes.length).toBeGreaterThan(0);
      expect(useFlowStore.getState().edges.length).toBeGreaterThan(0);
      
      clearFlow();
      
      expect(useFlowStore.getState().nodes).toHaveLength(0);
      expect(useFlowStore.getState().edges).toHaveLength(0);
    });
  });

  describe('Persistence', () => {
    it('should save to localStorage', () => {
      const { addNode, saveToLocalStorage } = useFlowStore.getState();
      
      addNode({ x: 50, y: 50 });
      saveToLocalStorage();
      
      const saved = localStorage.getItem('reactflow-workflow');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.nodes).toHaveLength(1);
    });

    it('should load from localStorage', () => {
      const { addNode, saveToLocalStorage, clearFlow, loadFromLocalStorage } = useFlowStore.getState();
      
      // Create and save data
      addNode({ x: 100, y: 200 });
      saveToLocalStorage();
      
      // Clear the store
      clearFlow();
      expect(useFlowStore.getState().nodes).toHaveLength(0);
      
      // Load from localStorage
      loadFromLocalStorage();
      
      const nodes = useFlowStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].position).toEqual({ x: 100, y: 200 });
    });
  });

  describe('Export/Import', () => {
    it('should export to JSON', () => {
      const { addNode, exportToJSON } = useFlowStore.getState();
      
      addNode({ x: 10, y: 20 });
      const json = exportToJSON();
      
      const parsed = JSON.parse(json);
      expect(parsed.nodes).toHaveLength(1);
      expect(parsed.edges).toBeDefined();
      expect(parsed.version).toBe('1.0');
      expect(parsed.exportedAt).toBeDefined();
    });

    it('should import from JSON', () => {
      const { importFromJSON } = useFlowStore.getState();
      
      const mockData = {
        nodes: [
          { id: 'test-1', position: { x: 0, y: 0 }, data: { label: 'Test Node' }, type: 'default' }
        ],
        edges: [
          { id: 'e1', source: 'test-1', target: 'test-2' }
        ],
        version: '1.0',
        exportedAt: new Date().toISOString(),
      };
      
      importFromJSON(JSON.stringify(mockData));
      
      const state = useFlowStore.getState();
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe('test-1');
      expect(state.edges).toHaveLength(1);
    });

    it('should handle invalid JSON import gracefully', () => {
      const { importFromJSON } = useFlowStore.getState();
      
      // This should not throw
      importFromJSON('invalid json');
      
      // Store should remain unchanged
      expect(useFlowStore.getState().nodes).toHaveLength(0);
    });
  });

  describe('Node Selection', () => {
    it('should set selected node', () => {
      const { addNode, setSelectedNode } = useFlowStore.getState();
      
      addNode({ x: 0, y: 0 });
      const node = useFlowStore.getState().nodes[0];
      
      setSelectedNode(node);
      
      expect(useFlowStore.getState().selectedNode).toEqual(node);
    });

    it('should clear selected node', () => {
      const { addNode, setSelectedNode } = useFlowStore.getState();
      
      addNode({ x: 0, y: 0 });
      const node = useFlowStore.getState().nodes[0];
      
      setSelectedNode(node);
      expect(useFlowStore.getState().selectedNode).toBeTruthy();
      
      setSelectedNode(null);
      expect(useFlowStore.getState().selectedNode).toBeNull();
    });

    it('should clear selected node when deleting it', () => {
      const { addNode, setSelectedNode, deleteNode } = useFlowStore.getState();
      
      addNode({ x: 0, y: 0 });
      const node = useFlowStore.getState().nodes[0];
      
      setSelectedNode(node);
      deleteNode(node.id);
      
      expect(useFlowStore.getState().selectedNode).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should handle large number of nodes efficiently', () => {
      const { generateBulkNodes } = useFlowStore.getState();
      
      const startTime = performance.now();
      generateBulkNodes(1000);
      const endTime = performance.now();
      
      const nodes = useFlowStore.getState().nodes;
      expect(nodes).toHaveLength(1000);
      
      // Should complete in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
