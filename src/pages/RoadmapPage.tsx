import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lightbulb, Loader2 } from 'lucide-react';
import { RoadmapViewer } from '@/components/RoadmapViewer';
import { ExecutionBotsPanel } from '@/components/ExecutionBotsPanel';
import { useRoadmapStore, useRoadmapActions } from '@/lib/roadmapStore';
import { toast } from 'sonner';
export default function RoadmapPage() {
  const initiatives = useRoadmapStore((s) => s.initiatives);
  const { optimizeRoadmap, exportToJSON, exportToCSV } = useRoadmapActions();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const handleOptimize = async () => {
    setIsOptimizing(true);
    toast.info("AI is optimizing the roadmap...");
    await optimizeRoadmap();
    toast.success("Roadmap optimized for maximum value and lowest risk.");
    setIsOptimizing(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Plan & Orchestrate</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Convert your chosen architecture into a prioritized, fundable transformation portfolio.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 xl:col-span-3">
                <ExecutionBotsPanel />
              </div>
              <div className="lg:col-span-8 xl:col-span-9">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Transformation Roadmap</CardTitle>
                      <CardDescription>Drag initiatives to re-prioritize.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleOptimize} disabled={isOptimizing} variant="outline">
                        {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                        AI Optimize
                      </Button>
                      <Button onClick={exportToJSON} variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" /> JSON
                      </Button>
                       <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" /> CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {initiatives.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <RoadmapViewer />
                        </motion.div>
                      ) : (
                        <div className="h-96 flex items-center justify-center text-muted-foreground text-center">
                          <div>
                            <p>No roadmap data available.</p>
                            <p className="text-sm">Select an option from the Design Canvas to generate a roadmap.</p>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterNote />
    </div>
  );
}