import { CircleAlert, CircleCheck, Info, type LucideIcon, TriangleAlert } from 'lucide-react';
import { WorkspaceEventSeverity } from '@/api/schema';
import {
  ROUTES,
  toChannelConnectionRoute,
  toOrderRoute,
  toProductRoute,
  toWebhookEndpointRoute,
} from '@/config/routes';
import { CATALOG_NODE_ID } from '@/features/channel-map';
import { AGENT_CONSOLE_COPY } from './agent-console.constants';
import type { WorkspaceEvent } from './agent-console.types';

/** Each severity's icon and colour; the icon and words carry it too, never colour alone. */
export const SEVERITY_PRESENTATION: Record<
  WorkspaceEventSeverity,
  { icon: LucideIcon; iconClass: string }
> = {
  [WorkspaceEventSeverity.info]: { icon: Info, iconClass: 'text-muted-foreground' },
  [WorkspaceEventSeverity.success]: { icon: CircleCheck, iconClass: 'text-success' },
  [WorkspaceEventSeverity.warning]: { icon: TriangleAlert, iconClass: 'text-warning' },
  [WorkspaceEventSeverity.error]: { icon: CircleAlert, iconClass: 'text-destructive' },
};

/** Who did it: "Claude for Dana", "Crossmart Agent", the API key's name, or Crossmart. */
function baseActorLabel({ actor }: WorkspaceEvent): string {
  if (actor.agentName && actor.name) {
    return AGENT_CONSOLE_COPY.onBehalfOf(actor.agentName, actor.name);
  }
  return actor.agentName ?? actor.name ?? AGENT_CONSOLE_COPY.system;
}

/** The actor, and who approved the change when an outside agent proposed it (ADR 0028). */
export function actorLabel(event: WorkspaceEvent): string {
  const label = baseActorLabel(event);
  const approver = event.actor.approvedByName;
  return approver ? AGENT_CONSOLE_COPY.approvedBy(label, approver) : label;
}

/** The map node an event is about: its store, else the catalog for a product; null for neither. */
export function eventNodeId({ refs }: WorkspaceEvent): string | null {
  if (refs.connectionId) return refs.connectionId;
  return refs.productId ? CATALOG_NODE_ID : null;
}

/** The page that shows what an event is about, the most specific first; null when none does. */
export function eventRoute({ refs }: WorkspaceEvent): string | null {
  if (refs.proposalId) return ROUTES.agentProposals;
  if (refs.orderId) return toOrderRoute(refs.orderId);
  if (refs.productId) return toProductRoute(refs.productId);
  if (refs.webhookEndpointId) return toWebhookEndpointRoute(refs.webhookEndpointId);
  if (refs.connectionId) return toChannelConnectionRoute(refs.connectionId);
  return null;
}
