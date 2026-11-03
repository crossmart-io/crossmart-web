import { TriangleAlert } from 'lucide-react';
import { PRICE_WARNING_MESSAGES } from '../listings.constants';
import type { ResolvedPrice } from '../listings.types';

/** How a channel price was reached, "$89.00 → +15% → .99 = $102.99", and what to watch for. */
export function PriceExplanation({ price }: { price: ResolvedPrice }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-sm break-words text-muted-foreground tabular-nums">{price.explanation}</p>
      {price.warnings.map((warning) => (
        <p key={warning} className="flex items-start gap-1.5 text-xs text-warning">
          <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          {PRICE_WARNING_MESSAGES[warning]}
        </p>
      ))}
    </div>
  );
}
