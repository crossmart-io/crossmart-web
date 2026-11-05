import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { fetchClient } from '@/api/client';
import { ITEM_SPECIFICS_ENDPOINT } from '../listings.constants';
import { useSaveItemSpecifics } from './useItemSpecifics';

vi.mock('@/api/client', () => ({ fetchClient: { PUT: vi.fn<() => Promise<unknown>>() }, api: {} }));

const REF = { workspaceId: 'ws-1', productId: 'p-1', connectionId: 'c-1' };
const SPECIFICS = [{ name: 'Material', values: ['Stoneware'] }];

function setup() {
  const client = new QueryClient();
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { invalidate, ...renderHook(() => useSaveItemSpecifics(REF), { wrapper }) };
}

describe('useSaveItemSpecifics', () => {
  it('replaces the listing’s item specifics and reads them again', async () => {
    const saved = { category: null, aspects: [], itemSpecifics: SPECIFICS };
    vi.mocked(fetchClient.PUT).mockResolvedValue({ data: saved } as never);
    const { result, invalidate } = setup();

    await act(() => result.current.mutateAsync(SPECIFICS));

    expect(fetchClient.PUT).toHaveBeenCalledWith(ITEM_SPECIFICS_ENDPOINT, {
      params: { path: REF },
      body: { itemSpecifics: SPECIFICS },
    });
    expect(invalidate).toHaveBeenCalled();
  });

  it('throws the API’s message', async () => {
    vi.mocked(fetchClient.PUT).mockResolvedValue({
      error: { statusCode: 400, message: 'Set each item specific once: color' },
    } as never);
    const { result } = setup();

    await expect(act(() => result.current.mutateAsync(SPECIFICS))).rejects.toThrow(
      'Set each item specific once',
    );
  });
});
