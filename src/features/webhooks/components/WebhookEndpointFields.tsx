import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { WebhookEndpointDraft, WebhookEndpointDraftErrors } from '../webhook-endpoint-form';
import { WEBHOOK_DESCRIPTION_MAX_LENGTH } from '../webhooks.constants';
import { WebhookEventPicker } from './WebhookEventPicker';

const URL_FIELD_ID = 'webhook-url';
const DESCRIPTION_FIELD_ID = 'webhook-description';
const URL_ERROR_ID = 'webhook-url-error';
const EVENTS_ERROR_ID = 'webhook-events-error';

interface WebhookEndpointFieldsProps {
  draft: WebhookEndpointDraft;
  onChange: (draft: WebhookEndpointDraft) => void;
  /** Shown once the user tried to save. */
  errors: WebhookEndpointDraftErrors;
}

/** The endpoint's URL, an optional note, and the events it receives. */
export function WebhookEndpointFields({ draft, onChange, errors }: WebhookEndpointFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={Boolean(errors.url)}>
        <FieldLabel htmlFor={URL_FIELD_ID}>Endpoint URL</FieldLabel>
        <Input
          id={URL_FIELD_ID}
          type="url"
          inputMode="url"
          value={draft.url}
          onChange={(event) => onChange({ ...draft, url: event.target.value })}
          placeholder="https://example.com/crossmart/webhooks"
          aria-invalid={Boolean(errors.url)}
          aria-describedby={errors.url ? URL_ERROR_ID : undefined}
          spellCheck={false}
        />
        <FieldDescription>Must be https and reachable from the internet.</FieldDescription>
        {errors.url && <FieldError id={URL_ERROR_ID}>{errors.url}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor={DESCRIPTION_FIELD_ID}>Description (optional)</FieldLabel>
        <Input
          id={DESCRIPTION_FIELD_ID}
          value={draft.description}
          maxLength={WEBHOOK_DESCRIPTION_MAX_LENGTH}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
          placeholder="Orders to the warehouse"
        />
      </Field>
      <FieldSet data-invalid={Boolean(errors.eventTypes)}>
        <FieldLegend variant="label">Events</FieldLegend>
        <WebhookEventPicker
          value={draft.eventTypes}
          onChange={(eventTypes) => onChange({ ...draft, eventTypes })}
          describedBy={errors.eventTypes ? EVENTS_ERROR_ID : undefined}
        />
        {errors.eventTypes && <FieldError id={EVENTS_ERROR_ID}>{errors.eventTypes}</FieldError>}
      </FieldSet>
    </FieldGroup>
  );
}
