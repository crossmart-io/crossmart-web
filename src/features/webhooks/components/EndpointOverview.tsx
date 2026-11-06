import { CircleAlert, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatDateTime } from '@/lib/format';
import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { endpointStateOf } from '../webhook-endpoint-state';
import { WEBHOOK_COPY, WebhookEndpointState } from '../webhooks.constants';
import { DetailItem } from './DetailItem';
import { EndpointStatusBadge } from './EndpointStatusBadge';
import { EventTypeBadges } from './EventTypeBadges';

/** Whether deliveries are still signed with the secret the last rotation replaced. */
function isRotationOverlapping(endpoint: WebhookEndpoint, now = Date.now()): boolean {
  const expiresAt = endpoint.previousSecretExpiresAt;
  return expiresAt !== null && new Date(expiresAt).getTime() > now;
}

/** What the endpoint receives and where it stands, with why Crossmart turned it off. */
export function EndpointOverview({ endpoint }: { endpoint: WebhookEndpoint }) {
  return (
    <div className="flex flex-col gap-4">
      {endpointStateOf(endpoint) === WebhookEndpointState.Failing && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Turned off after failures</AlertTitle>
          <AlertDescription>
            {WEBHOOK_COPY.failingNote(endpoint.consecutiveFailures)}
          </AlertDescription>
        </Alert>
      )}
      {isRotationOverlapping(endpoint) && (
        <Alert>
          <KeyRound />
          <AlertDescription>
            {WEBHOOK_COPY.rotationOverlap} {formatDateTime(endpoint.previousSecretExpiresAt)}.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Status">
              <EndpointStatusBadge endpoint={endpoint} />
            </DetailItem>
            <DetailItem label="Added">{formatDate(endpoint.createdAt)}</DetailItem>
            <DetailItem label="Description">{endpoint.description ?? '—'}</DetailItem>
            <DetailItem label="Turned off">{formatDateTime(endpoint.disabledAt)}</DetailItem>
            <div className="sm:col-span-2">
              <DetailItem label="Events">
                <EventTypeBadges eventTypes={endpoint.eventTypes} />
              </DetailItem>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
