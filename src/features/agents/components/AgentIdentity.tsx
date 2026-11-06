import { BadgeCheck, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type AgentClient, hasVerifiedName } from '../agent-authorization';
import { AGENT_IDENTITY_COPY, UNNAMED_AGENT } from '../agents.constants';
import { useAgentClient } from '../hooks/useAgentAuthorization';
import { UnverifiedNameBadge } from './UnverifiedNameBadge';

/**
 * Who is asking. An agent known by a metadata document shows the host its name was verified by.
 * One that registered itself shows its name as unverified, the site it claims, and why that
 * matters. Its logo is never shown, because any client can register one.
 */
export function AgentIdentity({ clientId }: { clientId: string | null }) {
  const { data: client } = useAgentClient(clientId);
  const verified = client ? hasVerifiedName(client) : false;
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-10" aria-hidden="true">
          <AvatarFallback>
            <Bot className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="truncate font-medium text-foreground">
              <bdi>{client?.name ?? UNNAMED_AGENT}</bdi>
            </p>
            {client && !verified && <UnverifiedNameBadge />}
          </div>
          {client && <AgentOrigin client={client} />}
        </div>
      </div>
      {client && !verified && (
        <p className="text-sm text-muted-foreground">
          {AGENT_IDENTITY_COPY.unverifiedNameExplanation}
        </p>
      )}
    </div>
  );
}

/** Where the agent comes from: the verified host, or the site it only claims. */
function AgentOrigin({ client }: { client: AgentClient }) {
  if (client.verifiedHost) {
    return (
      <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        <BadgeCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
        <span className="truncate">
          {AGENT_IDENTITY_COPY.verifiedBy} <bdi>{client.verifiedHost}</bdi>
        </span>
      </p>
    );
  }
  if (!client.claimedHost) return null;
  return (
    <p className="truncate text-sm text-muted-foreground">
      {AGENT_IDENTITY_COPY.claims} <bdi>{client.claimedHost}</bdi> (
      {AGENT_IDENTITY_COPY.unverifiedSite})
    </p>
  );
}
