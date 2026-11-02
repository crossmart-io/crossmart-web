import { ActivityAction, ActivitySubjectType } from '@/api/schema';
import { ROUTES, toProductRoute } from '@/config/routes';
import type { ActivityEvent } from './activity.types';

/** Actions whose subject no longer exists, so there is nothing to open. */
const GONE_SUBJECT_ACTIONS: ReadonlySet<ActivityAction> = new Set([
  ActivityAction.product_deleted,
  ActivityAction.api_key_revoked,
  ActivityAction.product_view_deleted,
]);

/** Where the event's subject can be opened, if anywhere. */
export function toSubjectRoute(event: ActivityEvent): string | undefined {
  const { subject } = event;
  if (!subject?.id || GONE_SUBJECT_ACTIONS.has(event.action)) return undefined;
  switch (subject.type) {
    case ActivitySubjectType.product:
      return toProductRoute(subject.id);
    case ActivitySubjectType.api_key:
      return ROUTES.apiKeys;
    case ActivitySubjectType.product_view:
    case ActivitySubjectType.catalog_import:
      return undefined;
  }
}
