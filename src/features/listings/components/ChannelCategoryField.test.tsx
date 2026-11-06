import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCategorySuggestions, useChooseListingCategory } from '../hooks/useListingCategory';
import { ChannelCategoryField } from './ChannelCategoryField';

vi.mock('../hooks/useListingCategory', () => ({
  useCategorySuggestions: vi.fn<typeof useCategorySuggestions>(),
  useChooseListingCategory: vi.fn<typeof useChooseListingCategory>(),
}));

const REF = { workspaceId: 'ws-1', productId: 'p-1', connectionId: 'c-1' };
const MUGS = { id: '20625', name: 'Home & Garden > Kitchen > Mugs' };

function setup(suggestions?: { id: string; name: string }[]) {
  const choose = vi.fn<(category: unknown) => void>();
  vi.mocked(useCategorySuggestions).mockReturnValue({
    data: suggestions,
    isFetching: false,
    error: null,
  } as never);
  vi.mocked(useChooseListingCategory).mockReturnValue({
    mutate: choose,
    isPending: false,
    error: null,
  } as never);
  return { choose };
}

describe('ChannelCategoryField', () => {
  it('says the category is picked on publish until one is chosen', () => {
    setup();
    render(<ChannelCategoryField channelRef={REF} category={null} />);

    expect(screen.getByText(/Picked from eBay’s suggestions/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Let eBay suggest' })).not.toBeInTheDocument();
  });

  it('searches with the keywords on Enter, without submitting a form', async () => {
    setup();
    const onSubmit = vi.fn<(event: Event) => void>((event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <ChannelCategoryField channelRef={REF} category={null} />
      </form>,
    );

    await userEvent.type(screen.getByLabelText('Search eBay categories'), 'coffee mug{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(vi.mocked(useCategorySuggestions)).toHaveBeenLastCalledWith(REF, 'coffee mug');
  });

  it('chooses a suggested category, or hands the choice back to eBay', async () => {
    const { choose } = setup([MUGS]);
    render(<ChannelCategoryField channelRef={REF} category={{ id: '1', name: 'Cups' }} />);

    expect(screen.getByText('Cups')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: MUGS.name }));
    await userEvent.click(screen.getByRole('button', { name: 'Let eBay suggest' }));

    expect(choose).toHaveBeenNthCalledWith(1, MUGS, expect.anything());
    expect(choose).toHaveBeenNthCalledWith(2, null, expect.anything());
  });

  it('says when eBay suggests nothing', () => {
    setup([]);
    render(<ChannelCategoryField channelRef={REF} category={null} />);

    expect(screen.getByText(/eBay suggested no category/)).toBeInTheDocument();
  });
});
