import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { NewWebhookEndpoint, WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { draftOf, hasDraftErrors, toEndpointBody, validateDraft } from '../webhook-endpoint-form';
import { EndpointFormError } from './EndpointFormError';
import { WebhookEndpointFields } from './WebhookEndpointFields';

const FORM_ID = 'webhook-endpoint-form';

/** Sending the form: the mutation's state, and how to start it. */
export interface EndpointSave {
  submit: (body: NewWebhookEndpoint) => void;
  error: Error | null;
  isPending: boolean;
}

interface WebhookEndpointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The endpoint to change; a new one is added without it. */
  endpoint?: WebhookEndpoint;
  save: EndpointSave;
}

const DIALOG_COPY = {
  add: {
    title: 'Add a webhook endpoint',
    description: 'Crossmart POSTs the events you pick to this URL, signed with a secret.',
    submit: 'Add endpoint',
  },
  edit: {
    title: 'Edit endpoint',
    description: 'Changes apply to the next events. Deliveries already made keep their URL.',
    submit: 'Save changes',
  },
} as const;

/** The dialog that adds or changes an endpoint. Its form starts over each time it opens. */
export function WebhookEndpointFormDialog({
  open,
  onOpenChange,
  endpoint,
  save,
}: WebhookEndpointFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <EndpointForm endpoint={endpoint} save={save} />
      </DialogContent>
    </Dialog>
  );
}

/** The endpoint's fields, checked before sending: a URL and at least one event. */
function EndpointForm({
  endpoint,
  save,
}: Pick<WebhookEndpointFormDialogProps, 'endpoint' | 'save'>) {
  const [draft, setDraft] = useState(() => draftOf(endpoint));
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateDraft(draft) : {};
  const copy = endpoint ? DIALOG_COPY.edit : DIALOG_COPY.add;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!hasDraftErrors(validateDraft(draft))) save.submit(toEndpointBody(draft));
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{copy.title}</DialogTitle>
        <DialogDescription>{copy.description}</DialogDescription>
      </DialogHeader>
      <EndpointFormError error={save.error} />
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <WebhookEndpointFields draft={draft} onChange={setDraft} errors={errors} />
      </form>
      <DialogFooter>
        <Button type="submit" form={FORM_ID} disabled={save.isPending}>
          {save.isPending && <Spinner data-icon="inline-start" />}
          {copy.submit}
        </Button>
      </DialogFooter>
    </>
  );
}
