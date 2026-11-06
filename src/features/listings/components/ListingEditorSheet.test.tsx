import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ListingDisplayState, PriceSource, PublishRequirement } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GenerateAvailability } from '@/features/suggestions';
import type * as Suggestions from '@/features/suggestions';
import { useListingEditor } from '../hooks/useListingEditor';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import {
  useAddToStore,
  useRemoveFromStore,
  useSaveListingOverride,
} from '../hooks/useProductChannels';
import { LISTING_EDITOR_COPY, OverrideSheetMode } from '../listings.constants';
import type { ListingOverride, ProductChannel } from '../listings.types';
import {
  channelVariantFixture,
  listingFixture,
  overrideFixture,
  productChannelFixture,
  productFixture,
} from '../testing/listing.fixture';
import { ListingEditorSheet } from './ListingEditorSheet';

vi.mock('../hooks/useListingEditor', () => ({
  useListingEditor: vi.fn<typeof useListingEditor>(),
}));
vi.mock('../hooks/useStoreMissing', () => ({ useStoreMissing: () => undefined }));
vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useSaveListingOverride: vi.fn<typeof useSaveListingOverride>(),
  useAddToStore: vi.fn<typeof useAddToStore>(),
  useRemoveFromStore: vi.fn<typeof useRemoveFromStore>(),
}));
vi.mock('@/features/suggestions', async (importOriginal) => ({
  ...(await importOriginal<typeof Suggestions>()),
  useGenerateAvailability: () => GenerateAvailability.Hidden,
}));

const REF = { workspaceId: 'ws-1', productId: 'p-1', connectionId: 'c-1' };
const PRODUCT = productFixture();

interface RenderOptions {
  canEdit?: boolean;
  mode?: OverrideSheetMode;
  /** The page's own form the editor sits in, as on the product page. */
  onOuterSubmit?: () => void;
}

function mockMutations(channel: ProductChannel) {
  const save = vi
    .fn<(body: ListingOverride) => Promise<ProductChannel>>()
    .mockResolvedValue(channel);
  vi.mocked(useSaveListingOverride).mockReturnValue({
    mutateAsync: save,
    error: null,
  } as unknown as ReturnType<typeof useSaveListingOverride>);
  const add = vi.fn<() => Promise<ProductChannel>>().mockResolvedValue(channel);
  vi.mocked(useAddToStore).mockReturnValue({
    mutateAsync: add,
    error: null,
  } as unknown as ReturnType<typeof useAddToStore>);
  vi.mocked(useRemoveFromStore).mockReturnValue({
    mutateAsync: vi.fn<() => Promise<ProductChannel>>(),
  } as unknown as ReturnType<typeof useRemoveFromStore>);
  return { save, add };
}

function renderEditor(channel: ProductChannel, options: RenderOptions = {}) {
  vi.mocked(useListingEditor).mockReturnValue({
    data: { product: PRODUCT, channel },
    isPending: false,
    error: null,
    isMissing: false,
    refetch: vi.fn<() => void>(),
  });
  const mutations = mockMutations(channel);
  const onClose = vi.fn<() => void>();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <form
            aria-label="Product"
            onSubmit={(event) => {
              event.preventDefault();
              options.onOuterSubmit?.();
            }}
          >
            <ListingEditorSheet
              listingRef={REF}
              catalogCurrency="USD"
              canEdit={options.canEdit ?? true}
              mode={options.mode}
              onClose={onClose}
            />
          </form>
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { ...mutations, onClose };
}

/** The field block around a control, which carries its origin. */
function fieldOf(element: HTMLElement): HTMLElement {
  const block = element.closest<HTMLElement>('[data-origin]');
  if (!block) throw new Error('The control is not inside a listing field.');
  return block;
}

describe('ListingEditorSheet', () => {
  it('names the product, the store and where the listing stands', () => {
    renderEditor(
      productChannelFixture({
        displayState: ListingDisplayState.needs_details,
        displayReason: 'eBay asks for a category',
        listing: listingFixture({ missingRequirement: PublishRequirement.category }),
      }),
    );

    const dialog = screen.getByRole('dialog', { name: 'Linen shirt' });
    expect(within(dialog).getByText('crossmartstore')).toBeInTheDocument();
    expect(within(dialog).getByText('Needs details')).toBeInTheDocument();
    expect(within(dialog).getByText('eBay asks for a category')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Choose a category' })).toBeInTheDocument();
  });

  it('shows fields the store does not change as coming from the product', () => {
    renderEditor(productChannelFixture());

    const title = screen.getByLabelText('Title');
    expect(title).toHaveValue('');
    expect(title).toHaveAttribute('placeholder', 'Linen shirt');
    expect(within(fieldOf(title)).getByText(LISTING_EDITOR_COPY.fromProduct)).toBeInTheDocument();
    expect(screen.getByText('Soft washed linen.')).toBeInTheDocument();
    expect(screen.getByText(LISTING_EDITOR_COPY.noChanges)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save })).toBeDisabled();
  });

  it('marks what the store changes, beside the product’s value', () => {
    renderEditor(productChannelFixture({ override: overrideFixture({ title: 'Shop title' }) }));

    const field = fieldOf(screen.getByLabelText('Title'));
    expect(within(field).getByText(LISTING_EDITOR_COPY.changedForStore)).toBeInTheDocument();
    expect(within(field).getByText(/Linen shirt/)).toBeInTheDocument();
    expect(screen.getByText(LISTING_EDITOR_COPY.changesLabel).parentElement).toHaveTextContent(
      'Title',
    );
  });

  it('goes back to the product’s value and saves it', async () => {
    const { save } = renderEditor(
      productChannelFixture({ override: overrideFixture({ title: 'Shop title' }) }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Use product value for title' }));

    const title = screen.getByLabelText('Title');
    expect(title).toHaveValue('');
    expect(within(fieldOf(title)).getByText(LISTING_EDITOR_COPY.fromProduct)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save }));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ title: null }));
  });

  it('saves only the listing when it opens inside the product page’s form', async () => {
    const onOuterSubmit = vi.fn<() => void>();
    const { save } = renderEditor(
      productChannelFixture({ override: overrideFixture({ title: 'Shop title' }) }),
      { onOuterSubmit },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Use product value for title' }));
    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save }));

    expect(save).toHaveBeenCalled();
    expect(onOuterSubmit).not.toHaveBeenCalled();
  });

  it('writes a description for this store from the product’s', async () => {
    const { save } = renderEditor(productChannelFixture());

    await userEvent.click(
      screen.getByRole('button', { name: `${LISTING_EDITOR_COPY.changeForStore}: description` }),
    );
    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save }));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ descriptionHtml: '<p>Soft washed linen.</p>' }),
    );
  });

  it('sets a variant’s price and compare-at price for this store, and reverts them', async () => {
    const { save } = renderEditor(
      productChannelFixture({
        override: overrideFixture({
          variantPrices: [{ variantId: 'v-1', price: '59.00', compareAtPrice: null }],
        }),
        variants: [
          channelVariantFixture({
            price: {
              ...channelVariantFixture().price,
              price: '59.00',
              source: PriceSource.override,
            },
          }),
        ],
      }),
    );

    const price = screen.getByLabelText('Price');
    expect(price).toHaveValue('59.00');
    expect(within(fieldOf(price)).getByText(/\$64\.00/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Compare-at price'), '75');
    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save }));
    expect(save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        variantPrices: [{ variantId: 'v-1', price: '59.00', compareAtPrice: '75' }],
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: /Use product value for/ }));
    expect(screen.getByLabelText('Price')).toHaveValue('');
  });

  it('brings every field back to the product at once', async () => {
    renderEditor(
      productChannelFixture({
        override: overrideFixture({ title: 'Shop title', tags: ['shop'] }),
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.resetAll }));

    expect(screen.getByText(LISTING_EDITOR_COPY.noChanges)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save })).toBeEnabled();
  });

  it('adds the product with its changes, then closes', async () => {
    const { add, onClose } = renderEditor(
      productChannelFixture({ selected: false, listing: null }),
      {
        mode: OverrideSheetMode.Add,
      },
    );

    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.add }));

    expect(add).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('only shows the listing to members who may not edit it', () => {
    renderEditor(productChannelFixture({ override: overrideFixture({ title: 'Shop title' }) }), {
      canEdit: false,
    });

    expect(screen.getByLabelText('Title')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: LISTING_EDITOR_COPY.save }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Use product value for title' }),
    ).not.toBeInTheDocument();
  });
});
