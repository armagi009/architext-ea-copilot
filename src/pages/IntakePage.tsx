import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, FileText, Loader2, Send, Sparkles, User, XCircle, Share2 } from 'lucide-react';
import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { IntakePanel } from '@/components/IntakePanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { chatService } from '@/lib/chat';
import { buildIntakePrompt } from '@/lib/ea-prompts';
import { toast } from 'sonner';
import { useGraphActions } from '@/lib/graphStore';
import { readFileAsText, parseTextToGraph } from '@/lib/ingestion';
interface BriefData {
  brief: string;
  kpis: string[];
  hypothesis: string;
  validationQuestions: { question: string; priority: string; impact: string }[];
  confidenceScore: number;
  evidence: { source: string; excerpt: string }[];
}
export default function IntakePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [graphGenerated, setGraphGenerated] = useState(false);
  const { setGraphData } = useGraphActions();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [streamingMessage, briefData]);
  const handleIngest = async (data: {
    engagementName: string;
    region: string;
    trigger: string;
    files: (File & { preview: string })[];
  }) => {
    setIsProcessing(true);
    setBriefData(null);
    setError(null);
    setStreamingMessage('');
    setGraphGenerated(false);
    const fileReadPromises = data.files.map(file => readFileAsText(file).then(content => ({ name: file.name, content })));
    try {
      const fileSnippets = await Promise.all(fileReadPromises);
      const prompt = buildIntakePrompt({ ...data, fileSnippets });
      chatService.newSession();
      await chatService.createSession(data.engagementName, chatService.getSessionId());
      let finalMessage = '';
      await chatService.sendMessage(prompt, undefined, (chunk) => {
        finalMessage += chunk;
        setStreamingMessage(prev => prev + chunk);
      });
      setStreamingMessage(''); // Clear streaming message once done
      try {
        const parsedData = JSON.parse(finalMessage);
        setBriefData(parsedData);
        toast.success("Engagement brief generated successfully!");
        // Post-brief generation: create canonical model
        const allText = fileSnippets.map(f => f.content).join('\n');
        const { nodes, edges } = parseTextToGraph(allText, "Uploaded Documents");
        setGraphData(nodes, edges);
        setGraphGenerated(true);
        toast.info("Preliminary canonical model generated.");
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError, "Response:", finalMessage);
        setError("The AI returned a response in an unexpected format. Please try again.");
        toast.error("AI response format error.");
      }
    } catch (e) {
      setError("An error occurred during ingestion. Please check the console for details.");
      toast.error("Ingestion failed.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 xl:col-span-4">
                <IntakePanel onIngest={handleIngest} isProcessing={isProcessing} />
              </div>
              <div className="lg:col-span-7 xl:col-span-8">
                <Card className="h-full flex flex-col min-h-[70vh]">
                  <CardHeader>
                    <CardTitle>2. AI-Generated Brief</CardTitle>
                  </CardHeader>
                  <ScrollArea className="flex-1" ref={scrollAreaRef as any}>
                    <CardContent className="p-6">
                      <AnimatePresence>
                        {!isProcessing && !briefData && !error && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-muted-foreground py-16"
                          >
                            <Sparkles className="mx-auto h-12 w-12 opacity-50" />
                            <p className="mt-4">Your engagement brief will appear here.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isProcessing && !streamingMessage && (
                        <div className="flex items-center gap-4 p-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <div>
                            <p className="font-semibold">Architext is thinking...</p>
                            <p className="text-sm text-muted-foreground">Generating your one-page brief.</p>
                          </div>
                        </div>
                      )}
                      {streamingMessage && (
                        <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">
                          {streamingMessage}<span className="animate-pulse">|</span>
                        </div>
                      )}
                      {error && (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-start gap-4">
                          <XCircle className="h-5 w-5 mt-0.5" />
                          <div>
                            <p className="font-semibold">An Error Occurred</p>
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                      )}
                      <AnimatePresence>
                        {briefData && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                          >
                            <div className="p-4 bg-accent/20 border-l-4 border-accent rounded-r-lg">
                              <h3 className="font-semibold text-accent-foreground">Engagement Brief</h3>
                              <p className="text-sm mt-2">{briefData.brief}</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold">Validation Questions</h3>
                              <div className="space-y-2">
                                {briefData.validationQuestions.map((q, i) => (
                                  <div key={i} className="text-sm p-3 bg-muted rounded-md">{q.question}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                                <Button>Approve Brief</Button>
                                <Button variant="outline" className="gap-1">
                                    <Share2 className="h-4 w-4" /> Share
                                </Button>
                                {graphGenerated && (
                                    <Link to="/graph">
                                        <Button variant="secondary">View Canonical Model</Button>
                                    </Link>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="relative">
                      <Textarea placeholder="Chat with Architext about this brief..." className="pr-12" />
                      <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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