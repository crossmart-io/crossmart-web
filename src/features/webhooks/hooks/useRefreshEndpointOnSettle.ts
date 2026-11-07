import { useEffect, useRef } from 'react';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { WEBHOOK_ENDPOINT_QUERIES } from '../webhooks.constants';

/**
 * Refetches the endpoint once its deliveries stop being in flight: how they ended changed its
 * last delivery and failure count.
 */
export function useRefreshEndpointOnSettle(inFlight: boolean): void {
  const refreshEndpoint = useInvalidateEndpoints(WEBHOOK_ENDPOINT_QUERIES);
  const wasInFlight = useRef(inFlight);
  useEffect(() => {
    if (wasInFlight.current && !inFlight) void refreshEndpoint();
    wasInFlight.current = inFlight;
  }, [inFlight, refreshEndpoint]);
}
