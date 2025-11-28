import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building, AppWindow, Database } from 'lucide-react';
import { EvidencePanel } from './EvidencePanel';
const typeConfig: { [key: string]: { icon: React.ElementType; color: string } } = {
  Capability: { icon: Building, color: 'border-blue-500' },
  App: { icon: AppWindow, color: 'border-green-500' },
  Infra: { icon: Database, color: 'border-purple-500' },
};
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const { label, type, confidence, validated } = data;
  const config = typeConfig[type] || { icon: Building, color: 'border-gray-500' };
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-background p-3 rounded-lg shadow-md border-2 w-48",
        config.color,
        validated ? 'shadow-green-500/40' : ''
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="font-bold truncate">{label}</div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <Badge variant="secondary">{type}</Badge>
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            borderColor: `hsla(120, 100%, ${validated ? '40' : '70'}%, 1)`,
            backgroundColor: `hsla(120, 100%, ${validated ? '50' : '80'}%, ${confidence})`,
          }}
          title={`Confidence: ${Math.round(confidence * 100)}%`}
        />
      </div>
    </motion.div>
  );
};
const nodeTypes = { custom: CustomNode };
interface GraphViewerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}
export function GraphViewer({ initialNodes, initialEdges }: GraphViewerProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
      <EvidencePanel node={selectedNode} isOpen={isPanelOpen} onOpenChange={setIsPanelOpen} />
    </div>
  );
}