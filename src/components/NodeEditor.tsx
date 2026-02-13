import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFlowStore } from '@/store/useFlowStore';
import { Trash2 } from 'lucide-react';

export function NodeEditor() {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const updateNode = useFlowStore((state) => state.updateNode);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
      setDescription(selectedNode.data.description || '');
    }
  }, [selectedNode]);

  const handleClose = () => {
    setSelectedNode(null);
  };

  const handleSave = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, { label, description });
    }
    handleClose()
  };

  const handleDelete = () => {
    if (selectedNode && confirm('Are you sure you want to delete this node?')) {
      deleteNode(selectedNode.id);
      handleClose();
    }
  };

  return (
    <Sheet open={!!selectedNode} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>
            Make changes to your node here. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="node-id">Node ID</Label>
            <Input 
              id="node-id" 
              value={selectedNode?.id || ''} 
              disabled 
              className="opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="node-label">Label</Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (selectedNode) {
                  updateNode(selectedNode.id, { label: e.target.value });
                }
              }}
              placeholder="Enter node label"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="node-description">Description</Label>
            <Input
              id="node-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (selectedNode) {
                  updateNode(selectedNode.id, { description: e.target.value });
                }
              }}
              placeholder="Enter node description"
            />
          </div>

          <div className="grid gap-2">
            <Label>Position</Label>
            <div className="flex gap-2">
              <Input
                value={`X: ${Math.round(selectedNode?.position.x || 0)}`}
                disabled
                className="opacity-50"
              />
              <Input
                value={`Y: ${Math.round(selectedNode?.position.y || 0)}`}
                disabled
                className="opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="default" 
            onClick={handleSave}
            className="flex-1"
          >
            Save Changes
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
