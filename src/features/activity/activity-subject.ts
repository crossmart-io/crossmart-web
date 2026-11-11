import { ActivityAction, ActivitySubjectType } from '@/api/schema';
import {
  PageSection,
  ReviewSource,
  ROUTES,
  toAgentReviewRoute,
  toStoreRoute,
  toImportJobRoute,
  toProductRoute,
  toWebhookEndpointRoute,
  withSection,
} from '@/config/routes';
import type { ActivityEvent } from './activity.types';

/** Actions whose subject no longer exists, so there is nothing to open. */
const GONE_SUBJECT_ACTIONS: ReadonlySet<ActivityAction> = new Set([
  ActivityAction.product_deleted,
  ActivityAction.api_key_revoked,
  ActivityAction.agent_disconnected,
  ActivityAction.product_view_deleted,
  ActivityAction.webhook_endpoint_deleted,
]);

/** Where each kind of subject opens, given its id. */
const SUBJECT_ROUTES: Record<ActivitySubjectType, (subjectId: string) => string | undefined> = {
  [ActivitySubjectType.product]: toProductRoute,
  [ActivitySubjectType.api_key]: () => withSection(ROUTES.developers, PageSection.ApiKeys),
  [ActivitySubjectType.agent_connection]: () =>
    withSection(ROUTES.developers, PageSection.ConnectedAgents),
  [ActivitySubjectType.webhook_endpoint]: toWebhookEndpointRoute,
  [ActivitySubjectType.import_job]: toImportJobRoute,
  [ActivitySubjectType.channel_connection]: (subjectId) => toStoreRoute(subjectId),
  [ActivitySubjectType.member]: () => ROUTES.team,
  [ActivitySubjectType.invitation]: () => ROUTES.team,
  [ActivitySubjectType.custom_role]: () => ROUTES.roles,
  [ActivitySubjectType.workspace]: () => ROUTES.generalSettings,
  [ActivitySubjectType.product_view]: () => undefined,
  [ActivitySubjectType.agent_proposal]: () => toAgentReviewRoute(ReviewSource.Proposals),
};

/** Where the event's subject can be opened, if anywhere. */
export function toSubjectRoute(event: ActivityEvent): string | undefined {
  const { subject } = event;
  if (!subject?.id || GONE_SUBJECT_ACTIONS.has(event.action)) return undefined;
  return SUBJECT_ROUTES[subject.type](subject.id);
}
