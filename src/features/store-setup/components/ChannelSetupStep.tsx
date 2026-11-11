import type { RefObject } from 'react';
import type { ChannelConnection } from '@/features/channels';
import type { SaveStep } from '../hooks/useStoreSetupSave';
import { EbaySetupStep } from './EbaySetupStep';
import { GoogleSetupStep } from './GoogleSetupStep';

interface ChannelSetupStepProps {
  workspaceId: string;
  connection: ChannelConnection;
  stepRef: RefObject<SaveStep | null>;
}

/** The channel's own minimum before it can list, or nothing once it is ready (Shopify always is). */
export function ChannelSetupStep({ workspaceId, connection, stepRef }: ChannelSetupStepProps) {
  if (connection.publishReadiness.ready) return null;
  if (connection.ebay) {
    return (
      <EbaySetupStep
        workspaceId={workspaceId}
        connection={connection}
        ebay={connection.ebay}
        stepRef={stepRef}
      />
    );
  }
  if (connection.googleMerchant) {
    return (
      <GoogleSetupStep
        workspaceId={workspaceId}
        connection={connection}
        google={connection.googleMerchant}
        stepRef={stepRef}
      />
    );
  }
  return null;
}
