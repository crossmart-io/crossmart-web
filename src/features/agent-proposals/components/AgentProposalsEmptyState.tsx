import { Bot } from 'lucide-react';
import { Link } from 'react-router';
import { AgentProposalStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ROUTES } from '@/config/routes';
import { AGENT_PROPOSALS_COPY, PROPOSAL_STATUS_LABELS } from '../agent-proposals.constants';

/** No proposals with this status; with none waiting, where proposals come from. */
export function AgentProposalsEmptyState({ status }: { status: AgentProposalStatus }) {
  const waiting = status === AgentProposalStatus.pending;
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bot />
        </EmptyMedia>
        <EmptyTitle>
          {waiting
            ? AGENT_PROPOSALS_COPY.emptyTitle
            : AGENT_PROPOSALS_COPY.emptyStatus(PROPOSAL_STATUS_LABELS[status])}
        </EmptyTitle>
        {waiting && <EmptyDescription>{AGENT_PROPOSALS_COPY.emptyDescription}</EmptyDescription>}
      </EmptyHeader>
      {waiting && (
        <EmptyContent>
          <Button variant="outline" asChild>
            <Link to={ROUTES.developers}>{AGENT_PROPOSALS_COPY.connectAgent}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
