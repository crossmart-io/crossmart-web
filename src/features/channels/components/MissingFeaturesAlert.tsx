import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MISSING_FEATURE_COPY, MISSING_FEATURES_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useStartChannelAuthorization } from '../hooks/useChannelConnections';

interface MissingFeaturesAlertProps {
  workspaceId: string;
  connection: ChannelConnection;
  /** Only workspace admins can approve the app again. */
  canManage: boolean;
}

/**
 * Says what a store cannot do until the merchant grants permissions it was connected without,
 * and sends admins to approve them all at once on the channel.
 */
export function MissingFeaturesAlert({
  workspaceId,
  connection,
  canManage,
}: MissingFeaturesAlertProps) {
  const authorize = useStartChannelAuthorization(workspaceId);
  const missing = connection.missingFeatures.map((feature) => MISSING_FEATURE_COPY[feature]);
  const [first] = missing;
  if (!first) return null;
  return (
    <Alert>
      <ShieldCheck />
      <AlertTitle>
        {missing.length === 1 ? first.title : MISSING_FEATURES_COPY.severalTitle}
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        {missing.length === 1 ? (
          <p>{first.effect}</p>
        ) : (
          <ul className="list-disc pl-4">
            {missing.map((copy) => (
              <li key={copy.title}>
                {copy.title}. {copy.effect}
              </li>
            ))}
          </ul>
        )}
        <p>{canManage ? MISSING_FEATURES_COPY.approve : MISSING_FEATURES_COPY.askAdmin}</p>
        {canManage && (
          <Button
            type="button"
            size="sm"
            disabled={authorize.isPending}
            onClick={() =>
              authorize.mutate({
                channel: connection.channel,
                accountHandle: connection.externalAccountId,
              })
            }
          >
            {authorize.isPending && <Spinner data-icon="inline-start" />}
            {MISSING_FEATURES_COPY.action}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
