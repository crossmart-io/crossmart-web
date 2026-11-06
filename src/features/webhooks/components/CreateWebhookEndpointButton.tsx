import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateWebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { WEBHOOK_COPY } from '../webhooks.constants';
import { WebhookEndpointFormDialog } from './WebhookEndpointFormDialog';
import { WebhookSecretDialog } from './WebhookSecretDialog';

/** Adds an endpoint, then shows its signing secret once. */
export function CreateWebhookEndpointButton({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const create = useCreateWebhookEndpoint(workspaceId);
  const created = create.data;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) create.reset();
  }

  return (
    <>
      <Button onClick={() => handleOpenChange(true)}>
        <Plus data-icon="inline-start" />
        {WEBHOOK_COPY.addEndpoint}
      </Button>
      <WebhookEndpointFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        save={{
          submit: (body) => create.mutate(body, { onSuccess: () => setOpen(false) }),
          error: create.error,
          isPending: create.isPending,
        }}
      />
      <WebhookSecretDialog
        secret={created?.secret}
        url={created?.endpoint.url ?? ''}
        onDone={() => create.reset()}
      />
    </>
  );
}
