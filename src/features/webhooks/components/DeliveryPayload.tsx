import { formatPayload } from '../delivery-format';
import { DELIVERY_COPY } from '../webhooks.constants';

const PAYLOAD_HEADING_ID = 'webhook-delivery-payload';

/** The JSON body every attempt sends, pretty-printed and scrollable. */
export function DeliveryPayload({ payload }: { payload: unknown }) {
  return (
    <section className="flex min-w-0 flex-col gap-2" aria-labelledby={PAYLOAD_HEADING_ID}>
      <h3 id={PAYLOAD_HEADING_ID} className="text-sm font-medium">
        {DELIVERY_COPY.payload}
      </h3>
      <pre className="max-h-96 overflow-auto rounded-md border bg-muted p-3 font-mono text-xs text-foreground">
        {formatPayload(payload)}
      </pre>
    </section>
  );
}
