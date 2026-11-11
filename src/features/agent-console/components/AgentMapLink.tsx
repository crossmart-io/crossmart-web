import { Network } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { toAgentRoute } from '@/config/routes';
import { AGENT_CONSOLE_COPY, ConsoleTab } from '../agent-console.constants';

/** A small link to Crossmart Agent's live map of the catalog and its stores. */
export function AgentMapLink() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to={toAgentRoute(ConsoleTab.Map)}>
        <Network data-icon="inline-start" />
        {AGENT_CONSOLE_COPY.viewMap}
      </Link>
    </Button>
  );
}
