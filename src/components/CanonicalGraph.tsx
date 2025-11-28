import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
const mockNodes = [
  { id: 'cap1', label: 'Order Management', type: 'Capability', confidence: 0.9, x: 10, y: 10 },
  { id: 'app1', label: 'SAP S/4HANA', type: 'App', confidence: 0.95, x: 10, y: 40 },
  { id: 'infra1', label: 'AWS EC2 (eu-central-1)', type: 'Infra', confidence: 0.8, x: 10, y: 70 },
  { id: 'cap2', label: 'Customer Relationship', type: 'Capability', confidence: 0.7, x: 50, y: 10 },
  { id: 'app2', label: 'Salesforce', type: 'App', confidence: 0.98, x: 50, y: 40 },
  { id: 'infra2', label: 'Salesforce Cloud', type: 'Infra', confidence: 1.0, x: 50, y: 70 },
];
const mockEdges = [
  { from: 'cap1', to: 'app1' },
  { from: 'app1', to: 'infra1' },
  { from: 'cap2', to: 'app2' },
  { from: 'app2', to: 'infra2' },
  { from: 'app1', to: 'app2' },
];
const typeColors: { [key: string]: string } = {
  Capability: 'bg-blue-500',
  App: 'bg-green-500',
  Infra: 'bg-purple-500',
};
export function CanonicalGraph() {
  const [selectedNode, setSelectedNode] = useState<(typeof mockNodes)[0] | null>(null);
  const [validatedNodes, setValidatedNodes] = useState<Set<string>>(new Set());
  const handleValidate = (nodeId: string) => {
    setValidatedNodes(prev => new Set(prev).add(nodeId));
  };
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Canonical Model (Mock)</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] relative bg-muted/30 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--muted-foreground))" opacity="0.5" />
            </marker>
          </defs>
          {mockEdges.map((edge, i) => {
            const fromNode = mockNodes.find(n => n.id === edge.from);
            const toNode = mockNodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={`${fromNode.x + 10}%`}
                y1={`${fromNode.y + 3}%`}
                x2={`${toNode.x + 10}%`}
                y2={`${toNode.y + 3}%`}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity="0.5"
                markerEnd="url(#arrow)"
              />
            );
          })}
        </svg>
        <Drawer>
          {mockNodes.map(node => (
            <DrawerTrigger asChild key={node.id}>
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute p-2 rounded-lg bg-background shadow-md cursor-pointer border"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${typeColors[node.type]}`} />
                  <span className="text-xs font-medium">{node.label}</span>
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: `hsla(120, 100%, ${validatedNodes.has(node.id) ? '40' : '70'}%, 1)`,
                      backgroundColor: `hsla(120, 100%, ${validatedNodes.has(node.id) ? '50' : '80'}%, ${node.confidence})`,
                    }}
                    title={`Confidence: ${Math.round(node.confidence * 100)}%`}
                  />
                </div>
                <Badge variant="secondary" className="mt-1 text-[10px]">{node.type}</Badge>
              </motion.div>
            </DrawerTrigger>
          ))}
          {selectedNode && (
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{selectedNode.label}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Evidence for this component will be displayed here.</p>
                <p className="mt-2 text-xs bg-muted p-2 rounded-md">
                  <strong>Source:</strong> contract.pdf <br />
                  <strong>Excerpt:</strong> "...SAP S/4HANA will serve as the primary ERP system..."
                </p>
                <Button
                  className="mt-4"
                  onClick={() => handleValidate(selectedNode.id)}
                  disabled={validatedNodes.has(selectedNode.id)}
                >
                  {validatedNodes.has(selectedNode.id) ? 'Validated' : 'Mark as Validated'}
                </Button>
              </div>
            </DrawerContent>
          )}
        </Drawer>
      </CardContent>
    </Card>
  );
}