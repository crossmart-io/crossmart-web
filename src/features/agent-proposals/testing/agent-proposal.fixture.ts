import { AgentProposalStatus, AgentProposerKind } from '@/api/schema';
import { MS_PER_DAY } from '@/lib/time';
import type { AgentProposal } from '../agent-proposals.types';

/** Claude's proposal to retitle a product, waiting for a decision. */
export function proposalFixture(fields: Partial<AgentProposal> = {}): AgentProposal {
  return {
    id: 'pr-1',
    toolName: 'update_product_text',
    toolTitle: 'Change the title or description of a product',
    status: AgentProposalStatus.pending,
    proposerKind: AgentProposerKind.oauth_agent,
    agentName: 'Claude',
    onBehalfOfName: 'Dana',
    summary: 'Change the title or description of a product: Linen Shirt',
    risks: [],
    preview: {
      target: 'Linen Shirt',
      headline: 'Change the title',
      details: [],
      changes: [{ label: 'Title', before: 'Linen Shirt', after: 'Linen Shirt Relaxed Fit' }],
    },
    targets: { connectionIds: [], productIds: ['p-1'] },
    result: null,
    isError: false,
    decidedByName: null,
    decidedAt: null,
    finishedAt: null,
    expiresAt: new Date(Date.now() + MS_PER_DAY).toISOString(),
    createdAt: new Date().toISOString(),
    ...fields,
  };
}
