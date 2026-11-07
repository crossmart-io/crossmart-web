import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchClient } from '@/api/client';
import { WebhookAttemptOutcome, WebhookDisabledReason, WebhookEventType } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import { apiError, apiOk } from '../testing/mock-api-client';
import { renderWithProviders } from '../testing/render';
import { ENDPOINT_REF, endpointFixture, WORKSPACE_ID } from '../testing/webhooks.fixture';
import {
  WEBHOOK_ENDPOINT_ENDPOINT,
  WEBHOOK_ENDPOINTS_ENDPOINT,
  WEBHOOK_ROTATE_SECRET_ENDPOINT,
} from '../webhooks.constants';
import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { WebhookEndpoints } from './WebhookEndpoints';

vi.mock('@/api/client', async () =>
  (await import('../testing/mock-api-client')).createMockApiClient(),
);

const SECRET = 'whsec_first_secret';
const ROTATED_SECRET = 'whsec_rotated_secret';

function listEndpoints(endpoints: WebhookEndpoint[]) {
  vi.mocked(fetchClient.GET).mockResolvedValue(apiOk(endpoints) as never);
}

function renderEndpoints() {
  renderWithProviders(<WebhookEndpoints workspaceId={WORKSPACE_ID} />);
}

async function openActions(url: string) {
  await userEvent.click(await screen.findByRole('button', { name: `Actions for ${url}` }));
}

describe('WebhookEndpoints', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists endpoints with their events, status and last delivery', async () => {
    listEndpoints([
      endpointFixture({
        lastDelivery: {
          attemptedAt: '2026-11-06T10:00:01Z',
          outcome: WebhookAttemptOutcome.SUCCEEDED,
          responseStatus: 200,
          error: null,
        },
      }),
      endpointFixture({
        id: 'ep-2',
        url: 'https://example.com/failing',
        enabled: false,
        disabledReason: WebhookDisabledReason.FAILING,
        consecutiveFailures: 30,
        lastDelivery: {
          attemptedAt: '2026-11-06T11:00:01Z',
          outcome: WebhookAttemptOutcome.FAILED,
          responseStatus: 503,
          error: 'The endpoint answered with HTTP 503',
        },
      }),
      endpointFixture({ id: 'ep-3', url: 'https://example.com/new' }),
    ]);
    renderEndpoints();

    expect(await screen.findByRole('link', { name: 'https://example.com/hooks' })).toBeVisible();
    expect(screen.getAllByText('Order created').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Enabled').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Turned off after failures').length).toBeGreaterThan(0);
    expect(screen.getAllByText('30 failed attempts in a row').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Delivered').length).toBeGreaterThan(0);
    expect(screen.getAllByText('· HTTP 503').length).toBeGreaterThan(0);
    expect(screen.getAllByText('No deliveries yet').length).toBeGreaterThan(0);
  });

  it('explains webhooks when there are none, with the guide', async () => {
    listEndpoints([]);
    renderEndpoints();

    expect(await screen.findByText('No webhook endpoints yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add endpoint' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /webhooks guide/ })).toHaveAttribute(
      'href',
      expect.stringContaining('docs/developers/webhooks.md'),
    );
  });

  it('checks the form, adds the endpoint and shows its secret once', async () => {
    const user = userEvent.setup();
    listEndpoints([]);
    const created = endpointFixture({ eventTypes: [WebhookEventType.order_created] });
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiOk({ endpoint: created, secret: SECRET }, 201) as never,
    );
    renderEndpoints();

    await user.click(await screen.findByRole('button', { name: 'Add endpoint' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Add endpoint' }));
    expect(within(dialog).getByText('Enter the URL that should receive events.')).toBeVisible();
    expect(within(dialog).getByText('Pick at least one event.')).toBeVisible();
    expect(fetchClient.POST).not.toHaveBeenCalled();

    await user.type(within(dialog).getByLabelText('Endpoint URL'), created.url);
    await user.click(within(dialog).getByRole('checkbox', { name: 'Order created' }));
    await user.click(within(dialog).getByRole('button', { name: 'Add endpoint' }));

    expect(fetchClient.POST).toHaveBeenCalledWith(WEBHOOK_ENDPOINTS_ENDPOINT, {
      params: { path: { workspaceId: WORKSPACE_ID } },
      body: { url: created.url, description: null, eventTypes: [WebhookEventType.order_created] },
    });
    expect(await screen.findByText(SECRET)).toBeVisible();
    expect(screen.getByText(/It will not be shown again/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByText(SECRET)).not.toBeInTheDocument());
  });

  it('shows the API’s reason when it refuses the URL', async () => {
    const user = userEvent.setup();
    listEndpoints([]);
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiError(400, { message: 'The URL must resolve to a public address' }) as never,
    );
    renderEndpoints();

    await user.click(await screen.findByRole('button', { name: 'Add endpoint' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Endpoint URL'), 'https://10.0.0.1/hooks');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Orders' }));
    await user.click(within(dialog).getByRole('button', { name: 'Add endpoint' }));

    expect(
      await within(dialog).findByText('The URL must resolve to a public address'),
    ).toBeVisible();
  });

  it('links to the plan when the plan has no room for another endpoint', async () => {
    const user = userEvent.setup();
    listEndpoints([]);
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiError(402, {
        message: 'The plan includes 10 webhook endpoints, and 10 are in use.',
      }) as never,
    );
    renderEndpoints();

    await user.click(await screen.findByRole('button', { name: 'Add endpoint' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Endpoint URL'), 'https://example.com/hooks');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Orders' }));
    await user.click(within(dialog).getByRole('button', { name: 'Add endpoint' }));

    expect(await within(dialog).findByText(/10 are in use/)).toBeVisible();
    expect(within(dialog).getByRole('link', { name: 'See plan & usage' })).toHaveAttribute(
      'href',
      ROUTES.plan,
    );
  });

  it('rotates the secret after confirming and shows the new one', async () => {
    const user = userEvent.setup();
    const endpoint = endpointFixture();
    listEndpoints([endpoint]);
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiOk({ endpoint, secret: ROTATED_SECRET }) as never,
    );
    renderEndpoints();

    await openActions(endpoint.url);
    await user.click(screen.getByRole('menuitem', { name: 'Rotate secret' }));
    const confirm = await screen.findByRole('alertdialog');
    expect(within(confirm).getByText(/next 24 hours/)).toBeVisible();
    await user.click(within(confirm).getByRole('button', { name: 'Rotate secret' }));

    expect(fetchClient.POST).toHaveBeenCalledWith(WEBHOOK_ROTATE_SECRET_ENDPOINT, {
      params: { path: ENDPOINT_REF },
    });
    expect(await screen.findByText(ROTATED_SECRET)).toBeVisible();
  });

  it('turns an endpoint off after confirming', async () => {
    const user = userEvent.setup();
    const endpoint = endpointFixture();
    listEndpoints([endpoint]);
    vi.mocked(fetchClient.PATCH).mockResolvedValue(
      apiOk({ ...endpoint, enabled: false, disabledReason: WebhookDisabledReason.MANUAL }) as never,
    );
    renderEndpoints();

    await openActions(endpoint.url);
    await user.click(screen.getByRole('menuitem', { name: 'Turn off' }));
    const confirm = await screen.findByRole('alertdialog');
    expect(within(confirm).getByText(/still pending or retrying fail/)).toBeVisible();
    await user.click(within(confirm).getByRole('button', { name: 'Turn off' }));

    expect(fetchClient.PATCH).toHaveBeenCalledWith(WEBHOOK_ENDPOINT_ENDPOINT, {
      params: { path: ENDPOINT_REF },
      body: { enabled: false },
    });
  });

  it('turns an endpoint back on at once', async () => {
    const user = userEvent.setup();
    const endpoint = endpointFixture({
      enabled: false,
      disabledReason: WebhookDisabledReason.MANUAL,
    });
    listEndpoints([endpoint]);
    vi.mocked(fetchClient.PATCH).mockResolvedValue(apiOk(endpointFixture()) as never);
    renderEndpoints();

    await openActions(endpoint.url);
    await user.click(screen.getByRole('menuitem', { name: 'Turn on' }));

    expect(fetchClient.PATCH).toHaveBeenCalledWith(WEBHOOK_ENDPOINT_ENDPOINT, {
      params: { path: ENDPOINT_REF },
      body: { enabled: true },
    });
  });
});
