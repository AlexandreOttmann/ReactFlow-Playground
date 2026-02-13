import { memo, useState, useEffect, useRef } from 'react';
import { useFlowStore } from '@/store/useFlowStore';

/**
 * Performance-optimized component that displays the selected node
 * Following ReactFlow best practices: we only subscribe to selectedNode,
 * not the entire nodes array, to avoid unnecessary re-renders
 */
export const PerformanceMonitor = memo(() => {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const nodeCount = useFlowStore((state) => state.nodes.length);
  const edgeCount = useFlowStore((state) => state.edges.length);
  
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number>();

  useEffect(() => {
    const calculateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;

      // Update FPS every second
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      rafIdRef.current = requestAnimationFrame(calculateFPS);
    };

    rafIdRef.current = requestAnimationFrame(calculateFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const getFpsColor = () => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="absolute bottom-50 right-4 z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
      <div className="font-semibold text-gray-700 mb-2">Performance Stats</div>
      <div className="space-y-1 text-gray-600">
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span className={`font-mono font-bold ${getFpsColor()}`}>{fps}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Nodes:</span>
          <span className="font-mono">{nodeCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Edges:</span>
          <span className="font-mono">{edgeCount}</span>
        </div>
        {selectedNode && (
          <div className="pt-2 border-t mt-2">
            <div className="font-medium text-gray-700">Selected:</div>
            <div className="text-xs font-mono">{selectedNode.id}</div>
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
