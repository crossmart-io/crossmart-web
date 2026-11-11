import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductStatus } from '@/api/schema';
import {
  connectionFixture,
  ebayConnectionFixture,
} from '@/features/channels/testing/channel-connection.fixture';
import { useUpdateSelection } from '@/features/listings/hooks/useConnectionRules';
import { StoreSetupForm } from './StoreSetupForm';

const { saveEbay } = vi.hoisted(() => ({
  saveEbay: vi.fn<(body: unknown) => Promise<unknown>>(),
}));

// The real eBay form runs; only its requests are mocked.
vi.mock('@/features/listings/hooks/useConnectionRules', () => ({
  useUpdateSelection: vi.fn<typeof useUpdateSelection>(),
}));
vi.mock('@/features/channels/hooks/useEbaySetup', () => ({
  useSaveEbayDefaults: () => ({ mutateAsync: saveEbay, error: null }),
  useCreateEbayDefaultPolicies: () => ({ mutate: vi.fn<() => void>(), isPending: false }),
}));

function mockSelection() {
  const saveRule = vi.fn<(rule: unknown) => Promise<unknown>>().mockResolvedValue({});
  vi.mocked(useUpdateSelection).mockReturnValue({ mutateAsync: saveRule, error: null } as never);
  return saveRule;
}

function renderForm(connection = connectionFixture()) {
  const onDone = vi.fn<() => void>();
  render(<StoreSetupForm workspaceId="ws-1" connection={connection} onDone={onDone} />);
  return onDone;
}

describe('StoreSetupForm', () => {
  it('adds every active product to a ready store with one click', async () => {
    const saveRule = mockSelection();
    const onDone = renderForm();

    expect(screen.getByRole('checkbox', { name: 'Add all my active products' })).toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveRule).toHaveBeenCalledWith({
      filter: { status: ProductStatus.ACTIVE },
      includeProductIds: [],
      excludeProductIds: [],
    });
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('leaves the rule off when the merchant unticks it', async () => {
    const saveRule = mockSelection();
    const onDone = renderForm();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Add all my active products' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveRule).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('asks eBay for its policies first, offering its defaults when there are none', async () => {
    const saveRule = mockSelection();
    saveEbay.mockResolvedValue(ebayConnectionFixture());
    renderForm(ebayConnectionFixture({ publishReadiness: { ready: false, missing: [] } }));

    expect(screen.getByRole('button', { name: 'Create default policies' })).toBeInTheDocument();
    expect(screen.getByLabelText('Shipping policy')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Postal code'), '10001');
    await userEvent.type(screen.getByLabelText('Country'), 'US');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveEbay).toHaveBeenCalledOnce();
    expect(saveRule).toHaveBeenCalledOnce();
  });

  it('closes without saving on Skip', async () => {
    const saveRule = mockSelection();
    const onDone = renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));

    expect(saveRule).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
});
