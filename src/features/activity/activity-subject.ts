import { ActivityAction, ActivitySubjectType } from '@/api/schema';
import {
  ROUTES,
  toChannelConnectionRoute,
  toImportJobRoute,
  toProductRoute,
  toWebhookEndpointRoute,
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
  [ActivitySubjectType.api_key]: () => ROUTES.apiKeys,
  [ActivitySubjectType.agent_connection]: () => ROUTES.agentConnections,
  [ActivitySubjectType.webhook_endpoint]: toWebhookEndpointRoute,
  [ActivitySubjectType.import_job]: toImportJobRoute,
  [ActivitySubjectType.channel_connection]: (subjectId) => toChannelConnectionRoute(subjectId),
  [ActivitySubjectType.member]: () => ROUTES.members,
  [ActivitySubjectType.invitation]: () => ROUTES.members,
  [ActivitySubjectType.custom_role]: () => ROUTES.roles,
  [ActivitySubjectType.workspace]: () => ROUTES.workspaceSettings,
  [ActivitySubjectType.product_view]: () => undefined,
};

/** Where the event's subject can be opened, if anywhere. */
export function toSubjectRoute(event: ActivityEvent): string | undefined {
  const { subject } = event;
  if (!subject?.id || GONE_SUBJECT_ACTIONS.has(event.action)) return undefined;
  return SUBJECT_ROUTES[subject.type](subject.id);
}
