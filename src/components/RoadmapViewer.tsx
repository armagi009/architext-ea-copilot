import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useRoadmapStore, useRoadmapActions, Initiative } from '@/lib/roadmapStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const SortableItem = ({ initiative }: { initiative: Initiative }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: initiative.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell className="w-8 cursor-grab" {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{initiative.name}</TableCell>
      <TableCell>{initiative.wave}</TableCell>
      <TableCell>${initiative.cost}k</TableCell>
      <TableCell>
        <Badge variant={initiative.risk === 'High' ? 'destructive' : 'secondary'}>{initiative.risk}</Badge>
      </TableCell>
      <TableCell>
        {initiative.isCompliant ? null : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
      </TableCell>
    </TableRow>
  );
};
export function RoadmapViewer() {
  const initiatives = useRoadmapStore((s) => s.initiatives);
  const { setInitiatives } = useRoadmapActions();
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = initiatives.findIndex((i) => i.id === active.id);
      const newIndex = initiatives.findIndex((i) => i.id === over.id);
      setInitiatives(arrayMove(initiatives, oldIndex, newIndex));
    }
  };
  const budgetData = initiatives.reduce((acc, curr) => {
    const wave = acc.find(w => w.name === curr.wave);
    if (wave) {
      wave.cost += curr.cost;
    } else {
      acc.push({ name: curr.wave, cost: curr.cost });
    }
    return acc;
  }, [] as { name: string; cost: number }[]);
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Prioritized Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={initiatives} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Initiative</TableHead>
                    <TableHead>Wave</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Policy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((initiative) => (
                    <SortableItem key={initiative.id} initiative={initiative} />
                  ))}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary by Wave</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value}k`} />
              <Legend />
              <Bar dataKey="cost" fill="hsl(var(--primary))" name="Budget ($k)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}