import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../Toolbar';
import { useFlowStore } from '@/store/useFlowStore';

describe('Toolbar', () => {
  beforeEach(() => {
    useFlowStore.setState({
      nodes: [],
      edges: [],
      selectedNode: null,
    });
    localStorage.clear();
  });

  it('should render toolbar with all buttons', () => {
    render(<Toolbar />);
    
    expect(screen.getByText('Add Node')).toBeInTheDocument();
    expect(screen.getByText('Generate Bulk')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should display node count', () => {
    const { rerender } = render(<Toolbar />);
    
    expect(screen.getByText('Nodes: 0')).toBeInTheDocument();
    
    // Add a node
    useFlowStore.getState().addNode();
    
    // Re-render to pick up the state change
    rerender(<Toolbar />);
    
    expect(screen.getByText('Nodes: 1')).toBeInTheDocument();
  });

  it('should add node when clicking Add Node button', () => {
    render(<Toolbar />);
    
    const addButton = screen.getByText('Add Node');
    fireEvent.click(addButton);
    
    expect(useFlowStore.getState().nodes).toHaveLength(1);
  });

  it('should save to localStorage when clicking Save button', () => {
    render(<Toolbar />);
    
    // Add a node first
    useFlowStore.getState().addNode();
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    const saved = localStorage.getItem('reactflow-workflow');
    expect(saved).toBeTruthy();
  });

  it('should load from localStorage when clicking Load button', () => {
    // Setup: save some data
    useFlowStore.getState().addNode();
    useFlowStore.getState().saveToLocalStorage();
    
    // Clear store
    useFlowStore.setState({ nodes: [], edges: [] });
    
    render(<Toolbar />);
    
    const loadButton = screen.getByText('Load');
    fireEvent.click(loadButton);
    
    expect(useFlowStore.getState().nodes).toHaveLength(1);
  });

  it('should prompt for bulk generation', () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('10');
    
    render(<Toolbar />);
    
    const bulkButton = screen.getByText('Generate Bulk');
    fireEvent.click(bulkButton);
    
    expect(promptSpy).toHaveBeenCalled();
    expect(useFlowStore.getState().nodes).toHaveLength(10);
    
    promptSpy.mockRestore();
  });

  it('should confirm before clearing all nodes', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    // Add some nodes
    useFlowStore.getState().addNode();
    useFlowStore.getState().addNode();
    
    render(<Toolbar />);
    
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(useFlowStore.getState().nodes).toHaveLength(0);
    
    confirmSpy.mockRestore();
  });

  it('should not clear nodes if user cancels confirmation', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    // Add some nodes
    useFlowStore.getState().addNode();
    
    render(<Toolbar />);
    
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(useFlowStore.getState().nodes).toHaveLength(1);
    
    confirmSpy.mockRestore();
  });
});
