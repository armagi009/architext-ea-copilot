import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { GraphViewer } from '@/components/GraphViewer';
import { useGraphNodes, useGraphEdges } from '@/lib/graphStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
export default function CanonicalModelPage() {
  const nodes = useGraphNodes();
  const edges = useGraphEdges();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Canonical Model</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                An interactive, evidence-backed view of your enterprise architecture.
              </p>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Architecture Graph</CardTitle>
                  <CardDescription>Click on nodes to view evidence and validate.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search model..." className="pl-9" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[600px] bg-muted/30 rounded-lg">
                  {nodes.length > 0 ? (
                    <GraphViewer initialNodes={nodes} initialEdges={edges} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No model data. Start a new intake to generate a graph.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <FooterNote />
    </div>
  );
}