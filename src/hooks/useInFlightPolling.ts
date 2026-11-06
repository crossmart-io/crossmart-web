import { useState } from 'react';
import { InFlightPolling } from '@/lib/in-flight-polling';

/**
 * A `refetchInterval` for a query whose items may still be in flight. Pass a function declared
 * outside the component; the interval keeps the first one it gets.
 */
export function useInFlightPolling<TData>(
  isInFlight: (data: TData) => boolean,
): InFlightPolling<TData>['interval'] {
  const [polling] = useState(() => new InFlightPolling(isInFlight));
  return polling.interval;
}
