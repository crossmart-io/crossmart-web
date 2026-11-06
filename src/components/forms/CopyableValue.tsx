import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const COPIED_FEEDBACK_MS = 2000;
const COPY_FAILED_MESSAGE = 'Could not copy. Select the text and copy it yourself.';

interface CopyableValueProps {
  value: string;
  /** The button's label, such as "Copy key". */
  copyLabel: string;
  /** The toast after a successful copy. */
  copiedMessage: string;
}

/** A value in a code box with a copy button, such as a secret or an address to paste elsewhere. */
export function CopyableValue({ value, copyLabel, copiedMessage }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(copiedMessage);
    } catch {
      toast.error(COPY_FAILED_MESSAGE);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
      <code className="min-w-0 flex-1 font-mono text-sm break-all text-foreground">{value}</code>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => void copy()}
        aria-label={copied ? 'Copied' : copyLabel}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
