import { Bot, KeyRound } from 'lucide-react';
import { AgentProposerKind } from '@/api/schema';
import { RelativeTime } from '@/components/time/RelativeTime';
import { AGENT_WORKER_COPY } from '@/features/agent-worker';
import { AGENT_PROPOSALS_COPY } from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';
import { ProposalStatusBadge } from './ProposalStatusBadge';

/** Who proposed it, for whom and when: "Claude for Dana · 5 minutes ago". */
function ProposedBy({ proposal }: { proposal: AgentProposal }) {
  const viaKey = proposal.proposerKind === AgentProposerKind.api_key;
  const Icon = viaKey ? KeyRound : Bot;
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      <bdi className="font-medium text-foreground">
        {AGENT_PROPOSALS_COPY.byAgent(proposal.agentName, proposal.onBehalfOfName)}
      </bdi>
      {viaKey && <span>({AGENT_PROPOSALS_COPY.viaKey})</span>}
      <span aria-hidden="true">·</span>
      <RelativeTime value={proposal.createdAt} />
    </p>
  );
}

/** What the change does in one line, what it touches, who proposed it, and where it stands. */
export function ProposalHeader({ proposal }: { proposal: AgentProposal }) {
  const target = proposal.preview?.target;
  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm leading-snug font-semibold">
          {proposal.preview?.headline ?? proposal.summary}
        </h3>
        <ProposalStatusBadge status={proposal.status} />
      </div>
      {target && (
        <p className="text-xs text-muted-foreground">
          {AGENT_WORKER_COPY.changeTarget} <bdi>{target}</bdi>
        </p>
      )}
      <ProposedBy proposal={proposal} />
    </header>
  );
}
