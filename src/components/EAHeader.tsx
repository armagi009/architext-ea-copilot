import { BrainCircuit, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
export function EAHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tighter">Architext</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/intake">
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Intake
              </Button>
            </Link>
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
    </header>
  );
}