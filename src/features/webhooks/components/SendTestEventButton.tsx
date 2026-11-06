import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSendWebhookTest, type WebhookEndpointRef } from '../hooks/useWebhookEndpoints';

/** Sends a `webhook.test` event; its delivery shows in the log within seconds. */
export function SendTestEventButton({ endpointRef }: { endpointRef: WebhookEndpointRef }) {
  const sendTest = useSendWebhookTest(endpointRef);
  return (
    <Button variant="outline" disabled={sendTest.isPending} onClick={() => sendTest.mutate()}>
      {sendTest.isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Send data-icon="inline-start" />
      )}
      Send test event
    </Button>
  );
}
