import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MISSING_FEATURE_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useStartChannelAuthorization } from '../hooks/useChannelConnections';

interface MissingFeaturesAlertProps {
  workspaceId: string;
  connection: ChannelConnection;
  /** Only workspace admins can approve the app again. */
  canManage: boolean;
}

/**
 * Says what a store cannot do until the merchant grants a permission it was connected without,
 * and sends admins to approve the app again on the channel. Nothing else changes for the store.
 */
export function MissingFeaturesAlert({
  workspaceId,
  connection,
  canManage,
}: MissingFeaturesAlertProps) {
  const authorize = useStartChannelAuthorization(workspaceId);
  const [feature] = connection.missingFeatures;
  if (!feature) return null;
  const copy = MISSING_FEATURE_COPY[feature];
  return (
    <Alert>
      <ShieldCheck />
      <AlertTitle>{copy.title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <p>{canManage ? copy.description : copy.askAdmin}</p>
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
            {copy.action}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
