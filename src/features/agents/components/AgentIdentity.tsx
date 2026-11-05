import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UNNAMED_AGENT } from '../agents.constants';
import { useAgentClient } from '../hooks/useAgentAuthorization';

function hostOf(address: string | undefined): string | undefined {
  if (!address) return undefined;
  try {
    return new URL(address).host;
  } catch {
    return undefined;
  }
}

/**
 * Who is asking: the agent's name and the site it says it belongs to. Its logo is not shown,
 * because any client can register one.
 */
export function AgentIdentity({ clientId }: { clientId: string | null }) {
  const { data: client } = useAgentClient(clientId);
  const site = hostOf(client?.client_uri) ?? hostOf(clientId ?? undefined);
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10" aria-hidden="true">
        <AvatarFallback>
          <Bot className="size-5" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{client?.client_name ?? UNNAMED_AGENT}</p>
        {site && <p className="truncate text-sm text-muted-foreground">{site}</p>}
      </div>
    </div>
  );
}
