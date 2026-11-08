import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { shortcutAria, shortcutLabel } from '@/lib/platform';
import { useAgentWorker } from '../agent-worker-context';
import {
  AGENT_WORKER_COPY,
  AGENT_WORKER_SHORTCUT_KEY,
  AGENT_WORKER_TEST_IDS,
} from '../agent-worker.constants';

const SHORTCUT_KEY_LABEL = AGENT_WORKER_SHORTCUT_KEY.toUpperCase();

/** The Agent Worker button in the app header, for a role that may use it. */
export function AgentWorkerLauncher() {
  const { canUse, openAgentWorker } = useAgentWorker();
  if (!canUse) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-keyshortcuts={shortcutAria(SHORTCUT_KEY_LABEL)}
          data-testid={AGENT_WORKER_TEST_IDS.launcher}
          onClick={() => openAgentWorker()}
        >
          <Sparkles data-icon="inline-start" className="text-brand" />
          <span className="max-sm:sr-only">{AGENT_WORKER_COPY.name}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {AGENT_WORKER_COPY.name} <Kbd>{shortcutLabel(SHORTCUT_KEY_LABEL)}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
