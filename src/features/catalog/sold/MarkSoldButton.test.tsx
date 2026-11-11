import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MARK_SOLD_COPY } from '../catalog.constants';
import { MarkSoldButton } from './MarkSoldButton';

function renderButton(available: number, storeNames: string[]) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MarkSoldButton
        workspaceId="ws-1"
        productId="p-1"
        title="Denim jacket"
        available={available}
        storeNames={storeNames}
      />
    </QueryClientProvider>,
  );
}

describe('MarkSoldButton', () => {
  it('confirms first, naming the stores it comes off', async () => {
    renderButton(1, ['eBay US', 'Main shop']);
    await userEvent.click(screen.getByRole('button', { name: MARK_SOLD_COPY.action }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('eBay US and Main shop');
  });

  it('shows that it is sold once nothing is left and it is in no store', () => {
    renderButton(0, []);
    expect(screen.getByRole('button', { name: MARK_SOLD_COPY.sold })).toBeDisabled();
  });
});
