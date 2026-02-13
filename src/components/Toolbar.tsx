import { Button } from '@/components/ui/button';
import { useFlowStore } from '@/store/useFlowStore';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Zap,
  Save,
  RefreshCw
} from 'lucide-react';
import { useRef } from 'react';

export function Toolbar() {
  const addNode = useFlowStore((state) => state.addNode);
  const clearFlow = useFlowStore((state) => state.clearFlow);
  const exportToJSON = useFlowStore((state) => state.exportToJSON);
  const importFromJSON = useFlowStore((state) => state.importFromJSON);
  const generateBulkNodes = useFlowStore((state) => state.generateBulkNodes);
  const saveToLocalStorage = useFlowStore((state) => state.saveToLocalStorage);
  const loadFromLocalStorage = useFlowStore((state) => state.loadFromLocalStorage);
  const nodes = useFlowStore((state) => state.nodes);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importFromJSON(content);
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateBulk = () => {
    const count = prompt('How many nodes to generate? (recommended: 10-1000)', '100');
    if (count) {
      const num = parseInt(count);
      if (!isNaN(num) && num > 0 && num <= 10000) {
        generateBulkNodes(num);
      } else {
        alert('Please enter a valid number between 1 and 10000');
      }
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all nodes and edges?')) {
      clearFlow();
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200 ">
      <div className="flex gap-2 items-center border-b pb-2 mb-2">
        <span className="text-sm font-semibold ">
          Nodes: {nodes.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 text-white">
        <Button 
          onClick={() => addNode()} 
          size="sm" 
          variant="default"
          className="justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Node
        </Button>

        <Button 
          onClick={handleGenerateBulk} 
          size="sm" 
          variant="default"
          className="justify-start"
        >
          <Zap className="h-4 w-4 mr-2" />
          Generate Bulk
        </Button>

        <div className="border-t pt-2 mt-2"></div>

        <Button 
          onClick={() => saveToLocalStorage()} 
          size="sm" 
          variant="outline"
          className="justify-start"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>

        <Button 
          onClick={() => loadFromLocalStorage()} 
          size="sm" 
          variant="outline"
          className="justify-start"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Load
        </Button>

        <div className="border-t pt-2 mt-2"></div>

        <Button 
          onClick={handleExport} 
          size="sm" 
          variant="outline"
          className="justify-start"
        >
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>

        <Button 
          onClick={handleImport} 
          size="sm" 
          variant="outline"
          className="justify-start"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import JSON
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="border-t pt-2 mt-2"></div>

        <Button 
          onClick={handleClear} 
          size="sm" 
          variant="destructive"
          className="justify-start"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
