import { toast } from 'sonner';
import { ApiRequestError, HttpStatus } from '@/api/api-error';
import { showApiErrorToast } from './api-error-toast';

vi.mock('./router', () => ({ router: { navigate: vi.fn<(path: string) => Promise<void>>() } }));
vi.mock('sonner', () => ({ toast: { error: vi.fn<(message: string) => void>() } }));

describe('showApiErrorToast', () => {
  beforeEach(() => vi.mocked(toast.error).mockClear());

  it('shows the message of an ordinary error', () => {
    showApiErrorToast(new ApiRequestError('SKU taken', HttpStatus.Conflict));
    expect(toast.error).toHaveBeenCalledWith('SKU taken');
  });

  it('links a read-only refusal to Billing', () => {
    showApiErrorToast(
      new ApiRequestError(
        'The account is read-only.',
        HttpStatus.PaymentRequired,
        'subscription_inactive',
      ),
    );
    expect(toast.error).toHaveBeenCalledWith('The account is read-only.', {
      action: { label: 'Billing', onClick: expect.any(Function) },
    });
  });
});
