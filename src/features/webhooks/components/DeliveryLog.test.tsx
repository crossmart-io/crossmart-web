import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchClient } from '@/api/client';
import { WebhookDeliveryStatus, WebhookEventType } from '@/api/schema';
import { apiOk } from '../testing/mock-api-client';
import { renderWithProviders } from '../testing/render';
import { deliveryDetailFixture, deliveryFixture, ENDPOINT_REF } from '../testing/webhooks.fixture';
import {
  WEBHOOK_DELIVERIES_ENDPOINT,
  WEBHOOK_DELIVERY_ENDPOINT,
  WEBHOOK_REDELIVER_ENDPOINT,
} from '../webhooks.constants';
import { DeliveryLog } from './DeliveryLog';

vi.mock('@/api/client', async () =>
  (await import('../testing/mock-api-client')).createMockApiClient(),
);

const FAILED = deliveryFixture({
  id: 'dl-2',
  eventType: WebhookEventType.listing_failed,
  status: WebhookDeliveryStatus.FAILED,
  attempts: 12,
  responseStatus: 500,
  error: 'The receiver answered 500',
});
const RETRYING = deliveryFixture({
  id: 'dl-3',
  eventType: WebhookEventType.product_updated,
  status: WebhookDeliveryStatus.RETRYING,
  responseStatus: null,
  nextAttemptAt: '2099-01-01T00:00:00Z',
});
const DELIVERED = deliveryFixture();

function stubLog() {
  const deliveries = [DELIVERED, FAILED, RETRYING];
  vi.mocked(fetchClient.GET).mockImplementation(((path: string) =>
    Promise.resolve(
      path === WEBHOOK_DELIVERY_ENDPOINT
        ? apiOk(deliveryDetailFixture(DELIVERED))
        : apiOk({ items: deliveries, nextCursor: null, total: deliveries.length }),
    )) as never);
  vi.mocked(fetchClient.POST).mockResolvedValue(apiOk(DELIVERED, 202) as never);
}

describe('DeliveryLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubLog();
  });

  it('shows each delivery’s status, its HTTP answer and why it failed', async () => {
    renderWithProviders(<DeliveryLog endpointRef={ENDPOINT_REF} />);

    expect(await screen.findByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Retrying')).toBeInTheDocument();
    expect(screen.getByText(/Next attempt/)).toBeInTheDocument();
    expect(screen.getByText('The receiver answered 500')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(fetchClient.GET).toHaveBeenCalledWith(WEBHOOK_DELIVERIES_ENDPOINT, {
      params: { path: ENDPOINT_REF, query: { status: undefined, page: 1, limit: 25 } },
      signal: expect.any(AbortSignal),
    });
  });

  it('redelivers one delivery', async () => {
    renderWithProviders(<DeliveryLog endpointRef={ENDPOINT_REF} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Redeliver Listing failed' }));

    expect(fetchClient.POST).toHaveBeenCalledWith(WEBHOOK_REDELIVER_ENDPOINT, {
      params: { path: { ...ENDPOINT_REF, deliveryId: FAILED.id } },
    });
  });

  it('opens a delivery with its JSON payload', async () => {
    renderWithProviders(<DeliveryLog endpointRef={ENDPOINT_REF} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Order created' }));

    const sheet = await screen.findByRole('dialog');
    expect(await within(sheet).findByText(/"name": "#1001"/)).toBeInTheDocument();
  });

  it('filters by the status in the URL', async () => {
    renderWithProviders(<DeliveryLog endpointRef={ENDPOINT_REF} />, '/?status=FAILED');

    await screen.findByText('Delivered');
    expect(fetchClient.GET).toHaveBeenCalledWith(WEBHOOK_DELIVERIES_ENDPOINT, {
      params: {
        path: ENDPOINT_REF,
        query: { status: WebhookDeliveryStatus.FAILED, page: 1, limit: 25 },
      },
      signal: expect.any(AbortSignal),
    });
  });
});
