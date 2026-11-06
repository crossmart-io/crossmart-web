import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { endpointQueryKey } from '@/api/query-keys';
import { SuggestionStatus } from '@/api/schema';
import { PRODUCTS_ENDPOINT } from '@/features/catalog/catalog.constants';
import { BULK_APPROVE_MAX } from '../suggestions.constants';
import type { Suggestion } from '../suggestions.types';
import { suggestionFixture } from '../testing/suggestion.fixture';
import { useBulkApproveSuggestions, useSuggestionReview } from './useSuggestionReview';

interface ApiResult {
  data: unknown;
  error: undefined;
  response: Response;
}

const post = vi.hoisted(() =>
  vi.fn<(path: string, init: { body?: unknown }) => Promise<ApiResult>>(),
);
vi.mock('@/api/client', () => ({ fetchClient: { POST: post } }));

function ok(data: unknown): ApiResult {
  return { data, error: undefined, response: new Response() };
}

function renderWithClient<Result>(hook: () => Result) {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const catalogKey = JSON.stringify(endpointQueryKey(PRODUCTS_ENDPOINT));
  const catalogRefreshed = () =>
    invalidate.mock.calls.some(([filters]) => JSON.stringify(filters?.queryKey) === catalogKey);
  return { ...renderHook(hook, { wrapper }), catalogRefreshed };
}

const applied = (overrides: Partial<Suggestion>) =>
  suggestionFixture({ status: SuggestionStatus.APPLIED, ...overrides });

describe('reviewing suggestions', () => {
  beforeEach(() => post.mockReset());

  it('approves more suggestions than the API takes at once, in batches', async () => {
    const ids = Array.from({ length: BULK_APPROVE_MAX + 1 }, (_, index) => `s-${index}`);
    post
      .mockResolvedValueOnce(ok({ items: [applied({ id: 's-0' })], skippedIds: ['s-1'] }))
      .mockResolvedValueOnce(ok({ items: [applied({ id: 's-100' })], skippedIds: [] }));
    const { result } = renderWithClient(() => useBulkApproveSuggestions('ws-1'));

    let reviewed: unknown;
    await act(async () => {
      reviewed = await result.current.mutateAsync(ids);
    });

    const bodies = post.mock.calls.map(([, init]) => init.body);
    expect(bodies).toEqual([
      { suggestionIds: ids.slice(0, BULK_APPROVE_MAX) },
      { suggestionIds: ids.slice(BULK_APPROVE_MAX) },
    ]);
    expect(reviewed).toMatchObject({
      items: [{ id: 's-0' }, { id: 's-100' }],
      skippedIds: ['s-1'],
    });
  });

  it('refreshes the catalog when an approval changed the product itself', async () => {
    post.mockResolvedValue(ok(applied({ connection: null })));
    const { result, catalogRefreshed } = renderWithClient(() => useSuggestionReview('ws-1'));

    act(() => result.current.approve.mutate('s-1'));

    await waitFor(() => expect(catalogRefreshed()).toBe(true));
  });

  it('leaves the catalog alone when the approval changed only a store', async () => {
    post.mockResolvedValue(ok(applied({})));
    const { result, catalogRefreshed } = renderWithClient(() => useSuggestionReview('ws-1'));

    act(() => result.current.approve.mutate('s-1'));

    await waitFor(() => expect(result.current.approve.isSuccess).toBe(true));
    expect(catalogRefreshed()).toBe(false);
  });
});
