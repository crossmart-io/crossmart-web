import { WorkspaceEventCategory, WorkspaceEventSeverity } from '@/api/schema';
import { EventFilter } from './agent-console.constants';
import type { WorkspaceEvent } from './agent-console.types';

const FILTER_CATEGORIES: Partial<Record<EventFilter, WorkspaceEventCategory>> = {
  [EventFilter.Agent]: WorkspaceEventCategory.agent,
  [EventFilter.Stores]: WorkspaceEventCategory.stores,
  [EventFilter.Orders]: WorkspaceEventCategory.orders,
};

/** Whether an event belongs under a filter: its category, or any error for `Errors`. */
export function matchesFilter(event: WorkspaceEvent, filter: EventFilter): boolean {
  if (filter === EventFilter.All) return true;
  if (filter === EventFilter.Errors) return event.severity === WorkspaceEventSeverity.error;
  return event.category === FILTER_CATEGORIES[filter];
}
