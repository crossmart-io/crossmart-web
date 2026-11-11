import type { RouteObject } from 'react-router';
import { LegacyRedirect } from '@/components/navigation/LegacyRedirect';
import type { LegacyTarget } from '@/components/navigation/legacy-redirect';
import {
  LEGACY_ROUTES,
  PageSection,
  ReviewSource,
  ROUTES,
  toAgentReviewRoute,
  toStoreRoute,
  toWebhookEndpointRoute,
  withSection,
} from '@/config/routes';

/** Old paths and where they live now (`LEGACY_ROUTES`); each keeps its query and hash. */
export const legacyRoutes: RouteObject[] = (
  [
    [LEGACY_ROUTES.channels, ROUTES.stores],
    [LEGACY_ROUTES.channelConnection, (params) => toStoreRoute(params.connectionId ?? '')],
    [
      LEGACY_ROUTES.channelConnectionTab,
      (params) => toStoreRoute(params.connectionId ?? '', params.tab),
    ],
    [LEGACY_ROUTES.channelMap, ROUTES.agent],
    [LEGACY_ROUTES.inventory, ROUTES.stock],
    [LEGACY_ROUTES.suggestions, toAgentReviewRoute(ReviewSource.Suggestions)],
    [LEGACY_ROUTES.agentProposals, toAgentReviewRoute(ReviewSource.Proposals)],
    [LEGACY_ROUTES.workspaceSettings, ROUTES.generalSettings],
    [LEGACY_ROUTES.members, ROUTES.team],
    [LEGACY_ROUTES.roles, ROUTES.roles],
    [LEGACY_ROUTES.apiKeys, withSection(ROUTES.developers, PageSection.ApiKeys)],
    [LEGACY_ROUTES.webhooks, withSection(ROUTES.developers, PageSection.Webhooks)],
    [LEGACY_ROUTES.webhookEndpoint, (params) => toWebhookEndpointRoute(params.endpointId ?? '')],
    [LEGACY_ROUTES.agentConnections, withSection(ROUTES.developers, PageSection.ConnectedAgents)],
    [LEGACY_ROUTES.account, ROUTES.account],
    [LEGACY_ROUTES.plan, ROUTES.billing],
  ] satisfies [string, LegacyTarget][]
).map(([path, to]) => ({ path, element: <LegacyRedirect to={to} /> }));
