import { Link } from 'react-router';
import { ActionsTableHead } from '@/components/lists/ActionsTableHead';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toWebhookEndpointRoute } from '@/config/routes';
import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { LAST_DELIVERY_COPY } from '../webhooks.constants';
import { EndpointActionsMenu } from './EndpointActionsMenu';
import { EndpointLastDelivery } from './EndpointLastDelivery';
import { EndpointStatusBadge } from './EndpointStatusBadge';
import { CompactEventTypeBadges } from './EventTypeBadges';

interface WebhookEndpointsTableProps {
  workspaceId: string;
  endpoints: readonly WebhookEndpoint[];
}

/**
 * The workspace's endpoints, each with its status and how its last delivery went. Each URL opens
 * the endpoint's delivery log.
 */
export function WebhookEndpointsTable({ workspaceId, endpoints }: WebhookEndpointsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead className="hidden lg:table-cell">Events</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">{LAST_DELIVERY_COPY.heading}</TableHead>
            <ActionsTableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <EndpointRow key={endpoint.id} workspaceId={workspaceId} endpoint={endpoint} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EndpointRow({
  workspaceId,
  endpoint,
}: {
  workspaceId: string;
  endpoint: WebhookEndpoint;
}) {
  return (
    <TableRow>
      <TableCell className="max-w-0 min-w-48">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            to={toWebhookEndpointRoute(endpoint.id)}
            className="truncate font-mono text-sm font-medium hover:underline focus-visible:underline"
            title={endpoint.url}
          >
            {endpoint.url}
          </Link>
          {endpoint.description && (
            <span className="truncate text-xs text-muted-foreground">{endpoint.description}</span>
          )}
          <div className="flex flex-col items-start gap-1 pt-1 md:hidden">
            <div className="sm:hidden">
              <EndpointStatusBadge endpoint={endpoint} />
            </div>
            <EndpointLastDelivery endpoint={endpoint} />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <CompactEventTypeBadges eventTypes={endpoint.eventTypes} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <EndpointStatusBadge endpoint={endpoint} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <EndpointLastDelivery endpoint={endpoint} />
      </TableCell>
      <TableCell className="text-right">
        <EndpointActionsMenu workspaceId={workspaceId} endpoint={endpoint} />
      </TableCell>
    </TableRow>
  );
}
