import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lightbulb, FileText, PlayCircle, Info, Loader2 } from 'lucide-react';
import { buildDesignPrompt } from '@/lib/ea-prompts';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
const mockOptions = [
  {
    title: 'Option A: Lift & Shift to Cloud',
    summary: 'Migrate existing SAP workloads to a public cloud provider with minimal refactoring. Focus on infrastructure cost savings and operational efficiency.',
    matrix: { cost: 2, benefit: 3, risk: 4, effort: 2 },
  },
  {
    title: 'Option B: Hybrid Cloud with Event Mesh',
    summary: 'Keep core ERP on-premise while moving satellite applications to the cloud. Integrate using an event-driven architecture for loose coupling.',
    matrix: { cost: 3, benefit: 4, risk: 3, effort: 4 },
  },
  {
    title: 'Option C: Full SaaS Migration',
    summary: 'Decommission the on-premise SAP system and migrate all business processes to a cloud-native SaaS ERP solution. Highest long-term value.',
    matrix: { cost: 4, benefit: 5, risk: 2, effort: 5 },
  },
];
const simData = [
  { name: 'Option A', cost: 4000, latency: 200 },
  { name: 'Option B', cost: 3000, latency: 150 },
  { name: 'Option C', cost: 5500, latency: 80 },
];
export default function DesignCanvas() {
  const [load, setLoad] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<any[]>(mockOptions);
  const handleGenerateOptions = async () => {
    setIsGenerating(true);
    const prompt = buildDesignPrompt("Reduce infra spend by 25% while keeping RTO <= 1 hour.");
    let finalMessage = '';
    await chatService.sendMessage(prompt, undefined, (chunk) => {
        finalMessage += chunk;
    });
    try {
        // This is a mock parsing. A real implementation would be more robust.
        const options = JSON.parse(finalMessage);
        setGeneratedOptions(options);
        toast.success("New architecture options generated!");
    } catch (e) {
        toast.error("AI returned an invalid format. Using mock data.");
        setGeneratedOptions(mockOptions); // Fallback to mock
    }
    setIsGenerating(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Design & Simulate</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Generate and compare target architectures. Simulate outcomes to make evidence-backed decisions.
              </p>
              <Button onClick={handleGenerateOptions} disabled={isGenerating} className="mt-4">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Generate New Options
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {generatedOptions.map((option, i) => (
                  <motion.div
                    key={option.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="flex flex-col h-full card-glow">
                      <CardHeader>
                        <CardTitle className="flex items-start gap-3">
                          <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <span>{option.title}</span>
                        </CardTitle>
                        <CardDescription>{option.summary}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cost</TableHead>
                              <TableHead>Benefit</TableHead>
                              <TableHead>Risk</TableHead>
                              <TableHead>Effort</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>{'●'.repeat(option.matrix.cost).padEnd(5, '○')}</TableCell>
                              <TableCell>{'●'.repeat(option.matrix.benefit).padEnd(5, '○')}</TableCell>
                              <TableCell>{'●'.repeat(option.matrix.risk).padEnd(5, '○')}</TableCell>
                              <TableCell>{'●'.repeat(option.matrix.effort).padEnd(5, '○')}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" /> ADR
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1 flex-1">
                              <PlayCircle className="h-4 w-4" /> Simulate
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Simulate: {option.title}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="mb-6">
                                <label className="text-sm font-medium">User Load ({load}%)</label>
                                <Slider defaultValue={[50]} max={100} step={1} onValueChange={(v) => setLoad(v[0])} />
                              </div>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={simData.map(d => ({ ...d, cost: d.cost * (load / 50) }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#F38020" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#6C63FF" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="cost" fill="#F38020" name="Est. Cost ($k)" />
                                    <Bar yAxisId="right" dataKey="latency" fill="#6C63FF" name="Latency (ms)" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-4 p-3 bg-muted rounded-md text-sm flex items-start gap-2">
                                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Simulation assumptions and evidence links will be displayed here.</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="text-center mt-12">
              <Button size="lg">Create Roadmap from Selected Option</Button>
            </div>
          </div>
        </div>
      </main>
      <FooterNote />
    </div>
  );
}