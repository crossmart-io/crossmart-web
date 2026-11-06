import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ListingDisplayState, PublishRequirement } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GenerateAvailability } from '@/features/suggestions';
import type * as Suggestions from '@/features/suggestions';
import { useListingEditor } from '../hooks/useListingEditor';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import {
  useAddToStore,
  usePatchListingOverride,
  useRemoveFromStore,
} from '../hooks/useProductChannels';
import { FieldOrigin } from '../listing-editor';
import { LISTING_EDITOR_COPY, OverrideSheetMode } from '../listings.constants';
import type { ListingEditor, ListingOverridePatch, ProductChannel } from '../listings.types';
import {
  listingEditorFixture,
  listingEditorVariantFixture,
  overridden,
  productChannelFixture,
} from '../testing/listing.fixture';
import { ListingEditorSheet } from './ListingEditorSheet';

vi.mock('../hooks/useListingEditor', () => ({
  useListingEditor: vi.fn<typeof useListingEditor>(),
}));
vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  usePatchListingOverride: vi.fn<typeof usePatchListingOverride>(),
  useAddToStore: vi.fn<typeof useAddToStore>(),
  useRemoveFromStore: vi.fn<typeof useRemoveFromStore>(),
}));
vi.mock('@/features/suggestions', async (importOriginal) => ({
  ...(await importOriginal<typeof Suggestions>()),
  useGenerateAvailability: () => GenerateAvailability.Hidden,
}));

const REF = { workspaceId: 'ws-1', productId: 'p-1', connectionId: 'c-1' };
const WITH_TITLE = listingEditorFixture({ title: overridden('Linen shirt', 'Shop title') });

interface RenderOptions {
  canEdit?: boolean;
  mode?: OverrideSheetMode;
  /** The page's own form the editor sits in, as on the product page. */
  onOuterSubmit?: () => void;
}

function mockMutations() {
  const channel = productChannelFixture();
  const patch = vi
    .fn<(body: ListingOverridePatch) => Promise<ProductChannel>>()
    .mockResolvedValue(channel);
  vi.mocked(usePatchListingOverride).mockReturnValue({
    mutateAsync: patch,
    error: null,
  } as unknown as ReturnType<typeof usePatchListingOverride>);
  const add = vi.fn<() => Promise<ProductChannel>>().mockResolvedValue(channel);
  vi.mocked(useAddToStore).mockReturnValue({
    mutateAsync: add,
    error: null,
  } as unknown as ReturnType<typeof useAddToStore>);
  vi.mocked(useRemoveFromStore).mockReturnValue({
    mutateAsync: vi.fn<() => Promise<ProductChannel>>(),
  } as unknown as ReturnType<typeof useRemoveFromStore>);
  return { patch, add };
}

function renderEditor(listing: ListingEditor, options: RenderOptions = {}) {
  vi.mocked(useListingEditor).mockReturnValue({
    data: listing,
    isPending: false,
    error: null,
    isMissing: false,
    refetch: vi.fn<() => void>(),
  });
  const mutations = mockMutations();
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

const save = () => userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save }));

describe('ListingEditorSheet', () => {
  it('names the product, the store and where the listing stands, with its fix', () => {
    renderEditor(
      listingEditorFixture({
        displayState: ListingDisplayState.needs_details,
        displayReason: 'eBay asks for a category',
        displayRequirement: PublishRequirement.category,
      }),
    );

    const dialog = screen.getByRole('dialog', { name: 'Linen shirt' });
    expect(within(dialog).getByText('crossmartstore')).toBeInTheDocument();
    expect(within(dialog).getByText('Needs details')).toBeInTheDocument();
    expect(within(dialog).getByText('eBay asks for a category')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Choose a category' })).toBeInTheDocument();
  });

  it('sends a product-level blocker to the exact place it is fixed', () => {
    renderEditor(
      listingEditorFixture({
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Add a product photo',
        displayRequirement: PublishRequirement.images,
      }),
    );

    expect(screen.getByRole('link', { name: 'Add a photo' })).toHaveAttribute(
      'href',
      '/products/p-1#media',
    );
  });

  it('shows fields the store does not change as coming from the product', () => {
    renderEditor(listingEditorFixture());

    const title = screen.getByLabelText('Title');
    expect(title).toHaveValue('');
    expect(title).toHaveAttribute('placeholder', 'Linen shirt');
    expect(within(fieldOf(title)).getByText(LISTING_EDITOR_COPY.fromProduct)).toBeInTheDocument();
    expect(screen.getByText('Soft washed linen.')).toBeInTheDocument();
    expect(screen.getByText(LISTING_EDITOR_COPY.noChanges)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LISTING_EDITOR_COPY.save })).toBeDisabled();
  });

  it('marks what the store changes, beside the product’s value', () => {
    renderEditor(WITH_TITLE);

    const field = fieldOf(screen.getByLabelText('Title'));
    expect(screen.getByLabelText('Title')).toHaveValue('Shop title');
    expect(within(field).getByText(LISTING_EDITOR_COPY.changedForStore)).toBeInTheDocument();
    expect(within(field).getByText(/Linen shirt/)).toBeInTheDocument();
    expect(screen.getByText(LISTING_EDITOR_COPY.changesLabel).parentElement).toHaveTextContent(
      'Title',
    );
  });

  it('goes back to the product’s value with a patch of that field alone', async () => {
    const { patch } = renderEditor(WITH_TITLE);

    await userEvent.click(screen.getByRole('button', { name: 'Use product value for title' }));

    const title = screen.getByLabelText('Title');
    expect(title).toHaveValue('');
    expect(within(fieldOf(title)).getByText(LISTING_EDITOR_COPY.fromProduct)).toBeInTheDocument();
    await save();
    expect(patch).toHaveBeenCalledWith({ title: null });
  });

  it('saves only the listing when it opens inside the product page’s form', async () => {
    const onOuterSubmit = vi.fn<() => void>();
    const { patch } = renderEditor(WITH_TITLE, { onOuterSubmit });

    await userEvent.click(screen.getByRole('button', { name: 'Use product value for title' }));
    await save();

    expect(patch).toHaveBeenCalled();
    expect(onOuterSubmit).not.toHaveBeenCalled();
  });

  it('writes a description for this store from the product’s', async () => {
    const { patch } = renderEditor(listingEditorFixture());

    await userEvent.click(
      screen.getByRole('button', { name: `${LISTING_EDITOR_COPY.changeForStore}: description` }),
    );
    await save();

    expect(patch).toHaveBeenCalledWith({ descriptionHtml: '<p>Soft washed linen.</p>' });
  });

  it('shows what the pricing rule charges beside a variant’s own price, and reverts it', async () => {
    const { patch } = renderEditor(
      listingEditorFixture({
        variants: [
          listingEditorVariantFixture({
            price: { product: '64.00', override: '59.00', effective: '59.00', overridden: true },
            rulePrice: '62.00',
          }),
        ],
      }),
    );

    const price = screen.getByLabelText('Price');
    expect(price).toHaveValue('59.00');
    expect(price).toHaveAttribute('placeholder', '62.00');
    expect(within(fieldOf(price)).getByText('Rule price $62.00')).toBeInTheDocument();
    expect(within(fieldOf(price)).getByText(/\$64\.00/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Compare-at price'), '75');
    await save();
    expect(patch).toHaveBeenLastCalledWith({
      variantPrices: [{ variantId: 'v-1', price: '59.00', compareAtPrice: '75' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Use product value for/ }));
    await save();
    expect(patch).toHaveBeenLastCalledWith({
      variantPrices: [{ variantId: 'v-1', price: null, compareAtPrice: null }],
    });
  });

  it('shows no rule price beside a price that follows the rule', () => {
    renderEditor(listingEditorFixture());

    expect(screen.queryByText(/^Rule price/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toHaveAttribute('placeholder', '64.00');
  });

  it('follows the product’s vendor, overrides it for this store, and reverts it', async () => {
    const { patch } = renderEditor(listingEditorFixture());

    const vendor = screen.getByLabelText('Vendor');
    expect(vendor).toHaveAttribute('placeholder', 'Northfield');
    expect(fieldOf(vendor)).toHaveAttribute('data-origin', FieldOrigin.Product);
    await userEvent.type(vendor, 'Shop brand');
    expect(fieldOf(vendor)).toHaveAttribute('data-origin', FieldOrigin.Store);
    expect(within(fieldOf(vendor)).getByText(/Northfield/)).toBeInTheDocument();
    await save();
    expect(patch).toHaveBeenLastCalledWith({ vendor: 'Shop brand' });

    await userEvent.click(screen.getByRole('button', { name: 'Use product value for vendor' }));
    await save();
    expect(patch).toHaveBeenLastCalledWith({ vendor: null });
  });

  it('names a missing product vendor beside the store’s own', () => {
    renderEditor(
      listingEditorFixture({
        vendor: {
          product: null,
          override: 'Shop brand',
          effective: 'Shop brand',
          overridden: true,
        },
      }),
    );

    expect(screen.getByLabelText('Vendor')).toHaveValue('Shop brand');
    expect(screen.getByText(LISTING_EDITOR_COPY.noVendor, { exact: false })).toBeInTheDocument();
  });

  it('brings every field back to the product at once', async () => {
    const { patch } = renderEditor(
      listingEditorFixture({
        title: overridden('Linen shirt', 'Shop title'),
        tags: overridden(['linen'], ['shop']),
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.resetAll }));

    expect(screen.getByText(LISTING_EDITOR_COPY.noChanges)).toBeInTheDocument();
    await save();
    expect(patch).toHaveBeenCalledWith({ title: null, tags: null });
  });

  it('adds the product with its changes, then closes', async () => {
    const { add, patch, onClose } = renderEditor(
      listingEditorFixture({ selected: false, listing: null }),
      { mode: OverrideSheetMode.Add },
    );

    await userEvent.click(screen.getByRole('button', { name: LISTING_EDITOR_COPY.add }));

    expect(patch).not.toHaveBeenCalled();
    expect(add).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('only shows the listing to members who may not edit it', () => {
    renderEditor(WITH_TITLE, { canEdit: false });

    expect(screen.getByLabelText('Title')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: LISTING_EDITOR_COPY.save }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Use product value for title' }),
    ).not.toBeInTheDocument();
  });
});
