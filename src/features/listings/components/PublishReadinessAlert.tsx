import { CircleDashed } from 'lucide-react';
import { Link } from 'react-router';
import type { PublishRequirement } from '@/api/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toStoreRoute, withSection } from '@/config/routes';
import { channelInfoFor } from '@/features/channels/channels.constants';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { ReconnectButton } from '@/features/channels/components/ReconnectButton';
import {
  FixTarget,
  missingSetup,
  PUBLISH_READINESS_COPY,
  PUBLISH_REQUIREMENT_FIXES,
} from '@/features/channels/publish-requirements';
import { ChannelTab } from '../channel-tabs';

interface PublishReadinessAlertProps {
  workspaceId: string;
  connection: ChannelConnection;
  /** Only workspace admins change a store's setup. */
  canManage: boolean;
}

interface MissingItemProps extends PublishReadinessAlertProps {
  requirement: PublishRequirement;
}

/** One thing the store lacks, and the way to it: its settings card, or connecting again. */
function MissingItem({ workspaceId, connection, canManage, requirement }: MissingItemProps) {
  const fix = PUBLISH_REQUIREMENT_FIXES[requirement];
  const channel = channelInfoFor(connection.channel);
  return (
    <li>
      {fix.missing}.{' '}
      {fix.target === FixTarget.StoreSettings && (
        <Link
          to={withSection(toStoreRoute(connection.id, ChannelTab.Settings), fix.section)}
          className="font-medium text-foreground underline"
        >
          {fix.action}
        </Link>
      )}
      {fix.target === FixTarget.Reconnect && canManage && channel?.connect && (
        <ReconnectButton
          workspaceId={workspaceId}
          channel={channel}
          connect={channel.connect}
          connection={connection}
        />
      )}
    </li>
  );
}

/**
 * Above the store's tabs while its setup keeps products from publishing: what is missing, in
 * plain words, each with the way to fix it. A store that needs reconnecting is left to the
 * reconnect alert, so this never repeats it.
 */
export function PublishReadinessAlert(props: PublishReadinessAlertProps) {
  const missing = missingSetup(props.connection);
  if (missing.length === 0) return null;
  return (
    <Alert>
      <CircleDashed />
      <AlertTitle>{PUBLISH_READINESS_COPY.title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-2">
        <ul className="flex list-disc flex-col gap-1 pl-4">
          {missing.map((requirement) => (
            <MissingItem key={requirement} {...props} requirement={requirement} />
          ))}
        </ul>
        {!props.canManage && <p>{PUBLISH_READINESS_COPY.askAdmin}</p>}
      </AlertDescription>
    </Alert>
  );
}
