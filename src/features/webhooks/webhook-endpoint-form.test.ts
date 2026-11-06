import { WebhookEventType } from '@/api/schema';
import { DRAFT_ERRORS, toEndpointBody, validateDraft } from './webhook-endpoint-form';

const VALID = {
  url: 'https://example.com/hooks',
  description: '',
  eventTypes: [WebhookEventType.order_created],
};

describe('webhook endpoint form', () => {
  it('accepts a full URL with at least one event', () => {
    expect(validateDraft(VALID)).toEqual({ url: undefined, eventTypes: undefined });
  });

  it('refuses a missing or partial URL', () => {
    expect(validateDraft({ ...VALID, url: ' ' }).url).toBe(DRAFT_ERRORS.urlRequired);
    expect(validateDraft({ ...VALID, url: 'example.com' }).url).toBe(DRAFT_ERRORS.urlInvalid);
    expect(validateDraft({ ...VALID, url: 'ftp://example.com' }).url).toBe(DRAFT_ERRORS.urlInvalid);
  });

  it('asks for an event', () => {
    expect(validateDraft({ ...VALID, eventTypes: [] }).eventTypes).toBe(
      DRAFT_ERRORS.eventsRequired,
    );
  });

  it('sends a trimmed URL and no empty description', () => {
    expect(toEndpointBody({ ...VALID, url: ` ${VALID.url} `, description: '  ' })).toEqual({
      url: VALID.url,
      description: null,
      eventTypes: VALID.eventTypes,
    });
  });
});
