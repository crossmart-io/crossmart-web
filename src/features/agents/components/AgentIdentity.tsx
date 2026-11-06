import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { agentSite } from '../agent-authorization';
import { UNNAMED_AGENT, UNVERIFIED_SITE_NOTE } from '../agents.constants';
import { useAgentClient } from '../hooks/useAgentAuthorization';

/**
 * Who is asking: the agent's name and its site, marked unverified when the agent only claims it.
 * Its logo is not shown, because any client can register one.
 */
export function AgentIdentity({ clientId }: { clientId: string | null }) {
  const { data: client } = useAgentClient(clientId);
  const site = agentSite(clientId, client?.client_uri);
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10" aria-hidden="true">
        <AvatarFallback>
          <Bot className="size-5" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{client?.client_name ?? UNNAMED_AGENT}</p>
        {site && (
          <p className="truncate text-sm text-muted-foreground">
            <bdi>{site.host}</bdi>
            {!site.verified && ` (${UNVERIFIED_SITE_NOTE})`}
          </p>
        )}
      </div>
    </div>
  );
}
