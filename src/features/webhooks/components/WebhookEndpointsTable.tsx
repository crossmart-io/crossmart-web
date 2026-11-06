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
import { EndpointActionsMenu } from './EndpointActionsMenu';
import { EndpointStatus } from './EndpointStatus';
import { CompactEventTypeBadges } from './EventTypeBadges';

interface WebhookEndpointsTableProps {
  workspaceId: string;
  endpoints: readonly WebhookEndpoint[];
}

/** The workspace's endpoints. Each URL opens the endpoint's delivery log. */
export function WebhookEndpointsTable({ workspaceId, endpoints }: WebhookEndpointsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead className="hidden md:table-cell">Events</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
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
          <div className="sm:hidden">
            <EndpointStatus endpoint={endpoint} />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <CompactEventTypeBadges eventTypes={endpoint.eventTypes} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <EndpointStatus endpoint={endpoint} />
      </TableCell>
      <TableCell className="text-right">
        <EndpointActionsMenu workspaceId={workspaceId} endpoint={endpoint} />
      </TableCell>
    </TableRow>
  );
}
