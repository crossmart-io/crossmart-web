import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { API_KEY_FEEDBACK } from '../api-keys.constants';

const COPIED_FEEDBACK_MS = 2000;

/** The key, shown once, with a copy button. */
export function SecretReveal({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success(API_KEY_FEEDBACK.copied);
    } catch {
      toast.error(API_KEY_FEEDBACK.copyFailed);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <code className="min-w-0 flex-1 font-mono text-sm break-all text-foreground">{secret}</code>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => void copy()}
          aria-label={copied ? 'Copied' : 'Copy key'}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Copy it now. For your security it is stored only as a hash and cannot be shown again.
      </p>
    </div>
  );
}
