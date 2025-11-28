import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Bot, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/lib/chat';
interface RunbookAssistantProps {
  initialPrompt?: string;
}
export function RunbookAssistant({ initialPrompt }: RunbookAssistantProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (initialPrompt) {
      handleSubmit(initialPrompt);
    }
  }, [initialPrompt]);
  const handleSubmit = async (prompt?: string) => {
    const message = prompt || input.trim();
    if (!message || isLoading) return;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    let fullResponse = '';
    await chatService.sendMessage(message, undefined, (chunk) => {
      fullResponse += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          return [...prev.slice(0, -1), { role: 'assistant', content: fullResponse }];
        }
        return [...prev, { role: 'assistant', content: chunk }];
      });
    });
    setIsLoading(false);
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Runbook Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            placeholder="Ask for RCA, mitigation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            className="pr-12"
            rows={2}
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}