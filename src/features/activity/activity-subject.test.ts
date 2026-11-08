import {
  ActivityAction,
  ActivityActorType,
  ActivityOutcome,
  ActivitySubjectType,
} from '@/api/schema';
import { toImportJobRoute, toProductRoute } from '@/config/routes';
import type { ActivityEvent } from './activity.types';
import { toSubjectRoute } from './activity-subject';

function productEvent(action: ActivityAction, id: string | null): ActivityEvent {
  return {
    id: 'event-1',
    action,
    outcome: ActivityOutcome.SUCCEEDED,
    summary: '',
    actor: {
      type: ActivityActorType.SYSTEM,
      userId: null,
      apiKeyId: null,
      agentClientId: null,
      name: null,
      email: null,
      agentName: null,
    },
    subject: { type: ActivitySubjectType.product, id, label: 'Mug' },
    itemCount: null,
    failureReason: null,
    connectionId: null,
    createdAt: '2026-11-02T10:00:00Z',
  };
}

describe('toSubjectRoute', () => {
  it('links to a product that still exists', () => {
    expect(toSubjectRoute(productEvent(ActivityAction.product_updated, 'p-1'))).toBe(
      toProductRoute('p-1'),
    );
  });

  it('links nowhere for a deleted product or a bulk action', () => {
    expect(toSubjectRoute(productEvent(ActivityAction.product_deleted, 'p-1'))).toBeUndefined();
    expect(
      toSubjectRoute(productEvent(ActivityAction.products_bulk_updated, null)),
    ).toBeUndefined();
  });

  it('links an import to its entry in the import history', () => {
    const event = productEvent(ActivityAction.stock_imported, null);
    expect(
      toSubjectRoute({
        ...event,
        subject: { type: ActivitySubjectType.import_job, id: 'job-1', label: 'stock.csv' },
      }),
    ).toBe(toImportJobRoute('job-1'));
  });
});
