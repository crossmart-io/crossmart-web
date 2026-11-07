import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { endpointQueryKey } from '@/api/query-keys';
import { WEBHOOK_ENDPOINT_ENDPOINT, WEBHOOK_ENDPOINTS_ENDPOINT } from '../webhooks.constants';
import { useRefreshEndpointOnSettle } from './useRefreshEndpointOnSettle';

function renderSettleHook(initiallyInFlight: boolean) {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const hook = renderHook(({ inFlight }) => useRefreshEndpointOnSettle(inFlight), {
    wrapper,
    initialProps: { inFlight: initiallyInFlight },
  });
  return { ...hook, invalidate };
}

describe('useRefreshEndpointOnSettle', () => {
  it('refetches the endpoint when its deliveries settle', () => {
    const { rerender, invalidate } = renderSettleHook(true);

    rerender({ inFlight: false });

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: endpointQueryKey(WEBHOOK_ENDPOINTS_ENDPOINT),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: endpointQueryKey(WEBHOOK_ENDPOINT_ENDPOINT),
    });
  });

  it('does nothing while deliveries stay in flight or were never in flight', () => {
    const { rerender, invalidate } = renderSettleHook(false);

    rerender({ inFlight: false });
    rerender({ inFlight: true });

    expect(invalidate).not.toHaveBeenCalled();
  });
});
