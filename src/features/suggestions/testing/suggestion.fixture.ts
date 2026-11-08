import {
  ChannelType,
  SuggestionAgent,
  SuggestionCreatorType,
  SuggestionKind,
  SuggestionStatus,
  type WorkspacePermission,
  WorkspaceRole,
  OutsideAgentChanges,
} from '@/api/schema';
import type { Workspace } from '@/features/workspaces';
import type { Suggestion } from '../suggestions.types';

export function suggestionFixture(overrides: Partial<Suggestion> = {}): Suggestion {
  return {
    id: 's-1',
    productId: 'p-1',
    productTitle: 'Stoneware mug',
    imageUrl: null,
    connection: { id: 'c-1', channel: ChannelType.ebay, displayName: 'eBay US' },
    kind: SuggestionKind.listing_title,
    status: SuggestionStatus.PENDING,
    currentValue: 'Blue mug',
    proposedValue: 'Blue stoneware mug, 350 ml',
    rationale: 'Names the material and size buyers filter by.',
    createdBy: {
      type: SuggestionCreatorType.AGENT,
      agent: SuggestionAgent.content_generator,
      userId: 'u-1',
      apiKeyId: null,
      name: 'Dana',
    },
    review: null,
    createdAt: '2026-11-05T09:00:00Z',
    updatedAt: '2026-11-05T09:00:00Z',
    ...overrides,
  };
}

export function workspaceFixture(permissions: WorkspacePermission[]): Workspace {
  return {
    id: 'ws-1',
    organizationId: 'org-1',
    name: 'Default',
    displayName: 'Acme',
    slug: 'acme',
    currency: 'USD',
    timeZone: null,
    sandbox: null,
    outsideAgentChanges: OutsideAgentChanges.require_approval,
    role: WorkspaceRole.CUSTOM,
    customRole: null,
    permissions,
  };
}
