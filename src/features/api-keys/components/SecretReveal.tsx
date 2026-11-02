import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const COPIED_FEEDBACK_MS = 2000;

/** The key, shown once, with a copy button. */
export function SecretReveal({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <code className="min-w-0 flex-1 font-mono text-sm break-all">{secret}</code>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={() => void copy()}
          aria-label="Copy key"
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
