import { Sparkles } from 'lucide-react';
import { useMatch } from 'react-router';
import { ROUTES } from '@/config/routes';
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

/**
 * The Crossmart Agent button in the app header, for a role that may use it: opens its page, and
 * shows as the current page there.
 */
export function AgentWorkerLauncher() {
  const { canUse, openAgentWorker } = useAgentWorker();
  const isOnPage = useMatch(ROUTES.agent) !== null;
  if (!canUse) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isOnPage ? 'secondary' : 'ghost'}
          size="sm"
          aria-current={isOnPage ? 'page' : undefined}
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
