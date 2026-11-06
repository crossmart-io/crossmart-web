import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WebhookEventType } from '@/api/schema';
import { SUBSCRIBABLE_EVENT_TYPES, WEBHOOK_EVENT_COPY } from '../webhooks.constants';
import { WebhookEventPicker } from './WebhookEventPicker';

function renderPicker(value: WebhookEventType[] = []) {
  const onChange = vi.fn<(eventTypes: WebhookEventType[]) => void>();
  render(<WebhookEventPicker value={value} onChange={onChange} />);
  return { onChange };
}

describe('WebhookEventPicker', () => {
  it('offers every event but the test event', () => {
    renderPicker();

    expect(
      screen.queryByRole('checkbox', {
        name: WEBHOOK_EVENT_COPY[WebhookEventType.webhook_test].label,
      }),
    ).not.toBeInTheDocument();
    expect(SUBSCRIBABLE_EVENT_TYPES).not.toContain(WebhookEventType.webhook_test);
    for (const eventType of SUBSCRIBABLE_EVENT_TYPES) {
      expect(
        screen.getByRole('checkbox', { name: WEBHOOK_EVENT_COPY[eventType].label }),
      ).toBeInTheDocument();
    }
  });

  it('picks every event of a group at once', async () => {
    const { onChange } = renderPicker([WebhookEventType.order_created]);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Listings' }));

    expect(onChange).toHaveBeenCalledWith([
      WebhookEventType.order_created,
      WebhookEventType.listing_published,
      WebhookEventType.listing_failed,
      WebhookEventType.listing_removed,
    ]);
  });

  it('marks a partly picked group', () => {
    renderPicker([WebhookEventType.order_created]);

    expect(screen.getByRole('checkbox', { name: 'Orders' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
  });
});
