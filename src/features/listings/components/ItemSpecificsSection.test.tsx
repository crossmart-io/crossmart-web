import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryAspectMode, CategoryAspectUsage } from '@/api/schema';
import { useItemSpecifics, useSaveItemSpecifics } from '../hooks/useItemSpecifics';
import type { CategoryAspect, ListingItemSpecifics } from '../listings.types';
import { ItemSpecificsSection } from './ItemSpecificsSection';

vi.mock('../hooks/useItemSpecifics', () => ({
  useItemSpecifics: vi.fn<typeof useItemSpecifics>(),
  useSaveItemSpecifics: vi.fn<typeof useSaveItemSpecifics>(),
}));

const REF = { workspaceId: 'ws-1', productId: 'p-1', connectionId: 'c-1' };

function aspect(name: string, overrides: Partial<CategoryAspect> = {}): CategoryAspect {
  return {
    name,
    required: false,
    usage: CategoryAspectUsage.recommended,
    mode: CategoryAspectMode.free_text,
    multiple: false,
    values: [],
    ...overrides,
  };
}

const VIEW: ListingItemSpecifics = {
  category: { id: '20625', name: 'Home & Garden > Mugs' },
  aspects: [
    aspect('Brand', { required: true, values: ['Acme'] }),
    aspect('Material', { required: true }),
    aspect('Color', { multiple: true, values: ['Blue', 'White'] }),
  ],
  itemSpecifics: [],
};

function setup(view: ListingItemSpecifics = VIEW) {
  const save = vi.fn<(body: unknown) => void>();
  vi.mocked(useItemSpecifics).mockReturnValue({
    data: view,
    dataUpdatedAt: 1,
    isPending: false,
    error: null,
  } as never);
  vi.mocked(useSaveItemSpecifics).mockReturnValue({
    mutate: save,
    isPending: false,
    error: null,
  } as never);
  return { save };
}

describe('ItemSpecificsSection', () => {
  it('shows nothing until the listing has a category', () => {
    setup();
    render(<ItemSpecificsSection channelRef={REF} hasCategory={false} vendor="Acme" />);

    expect(screen.queryByText('Item specifics')).not.toBeInTheDocument();
    expect(vi.mocked(useItemSpecifics)).toHaveBeenCalledWith(REF, false);
  });

  it('lists required specifics first, prefills Brand and names the missing ones', () => {
    setup();
    render(<ItemSpecificsSection channelRef={REF} hasCategory vendor="Acme" />);

    expect(screen.getByLabelText(/^Brand/)).toHaveValue('Acme');
    expect(screen.getAllByText('Required')).toHaveLength(2);
    expect(screen.getByText(/Still required:/)).toHaveTextContent('Material');
    expect(screen.queryByLabelText(/^Color/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save item specifics' })).toBeDisabled();
  });

  it('saves the values typed, including the folded recommended ones', async () => {
    const { save } = setup();
    render(<ItemSpecificsSection channelRef={REF} hasCategory vendor="Acme" />);

    await userEvent.type(screen.getByLabelText(/^Material/), 'Stoneware');
    await userEvent.click(screen.getByRole('button', { name: /More specifics/ }));
    await userEvent.type(screen.getByRole('combobox', { name: 'Color' }), 'Blue{Enter}White,');
    await userEvent.click(screen.getByRole('button', { name: 'Save item specifics' }));

    expect(screen.queryByText(/Still required:/)).not.toBeInTheDocument();
    expect(save).toHaveBeenCalledWith([
      { name: 'Brand', values: ['Acme'] },
      { name: 'Material', values: ['Stoneware'] },
      { name: 'Color', values: ['Blue', 'White'] },
    ]);
  });

  it('keeps saved values over the vendor', () => {
    setup({ ...VIEW, itemSpecifics: [{ name: 'Brand', values: ['Potter & Co'] }] });
    render(<ItemSpecificsSection channelRef={REF} hasCategory vendor="Acme" />);

    expect(screen.getByLabelText(/^Brand/)).toHaveValue('Potter & Co');
  });

  it('shows the folded specifics at once when one of them is set', () => {
    setup({ ...VIEW, itemSpecifics: [{ name: 'Color', values: ['Blue'] }] });
    render(<ItemSpecificsSection channelRef={REF} hasCategory vendor="Acme" />);

    expect(screen.getByRole('button', { name: /Fewer specifics/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('list', { name: 'Color values' })).toHaveTextContent('Blue');
  });

  it('says when eBay lists no specifics for the category', () => {
    setup({ ...VIEW, aspects: [] });
    render(<ItemSpecificsSection channelRef={REF} hasCategory vendor={null} />);

    expect(screen.getByText(/lists no item specifics/)).toBeInTheDocument();
  });
});
