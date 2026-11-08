import { Sparkles } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { useAgentWorker } from '../agent-worker-context';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { OpenAgentWorkerOptions } from '../agent-worker.types';

interface AskAgentWorkerButtonProps extends OpenAgentWorkerOptions {
  label?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
  className?: string;
  testId?: string;
}

/**
 * Opens Agent Worker about what is on screen: the page's context, and maybe text to start from.
 * Renders nothing for a role that may not use Agent Worker.
 */
export function AskAgentWorkerButton({
  context,
  prefill,
  label = AGENT_WORKER_COPY.open,
  variant = 'outline',
  size = 'sm',
  className,
  testId,
}: AskAgentWorkerButtonProps) {
  const { canUse, openAgentWorker } = useAgentWorker();
  if (!canUse) return null;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      data-testid={testId}
      onClick={() => openAgentWorker({ context, prefill })}
    >
      <Sparkles data-icon="inline-start" className="text-brand" />
      {label}
    </Button>
  );
}
