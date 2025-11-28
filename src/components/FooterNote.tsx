import { ShieldCheck } from 'lucide-react';
export function FooterNote() {
  return (
    <footer className="w-full mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-border/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>
              AI Capabilities: Requests to model endpoints are subject to platform limits. Heavy usage may be rate-limited.
            </span>
          </p>
          <p>Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}