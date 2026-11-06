import { Link } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { useReturnToState } from '@/components/navigation/return-to';
import { toProductRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import { usePricingPreview } from '../hooks/usePreviews';
import { PRICING_EXAMPLE_VARIANT_LIMIT, PRICING_RULE_COPY } from '../listings.constants';
import type { PricingRule } from '../listings.types';
import { PriceExplanation } from './PriceExplanation';

interface PricingExampleProps {
  workspaceId: string;
  connectionId: string;
  /** The rule being edited; null while the form is invalid. */
  rule: PricingRule | null;
}

/**
 * The rule applied live to a real product, the first one the connection lists. Only its first
 * variants show: a product with dozens of them would bury the rule under the same formula.
 */
export function PricingExample({ workspaceId, connectionId, rule }: PricingExampleProps) {
  const returnTo = useReturnToState();
  const preview = usePricingPreview({ workspaceId, connectionId }, rule, rule !== null);

  if (!preview.data) {
    return <Skeleton className="h-20 w-full" />;
  }
  const { product, variants, currencyCode } = preview.data;
  const shown = variants.slice(0, PRICING_EXAMPLE_VARIANT_LIMIT);
  const hidden = variants.length - shown.length;
  if (!product) {
    return <p className="text-sm text-muted-foreground">{PRICING_RULE_COPY.noExample}</p>;
  }
  return (
    <div
      className="flex flex-col gap-3 self-start rounded-lg border bg-muted/30 p-3"
      aria-live="polite"
    >
      <p className="text-sm">
        {PRICING_RULE_COPY.exampleLabel}{' '}
        <Link to={toProductRoute(product.id)} state={returnTo} className="font-medium underline">
          {product.title}
        </Link>
      </p>
      <ul className="flex flex-col gap-3">
        {shown.map((variant) => (
          <li key={variant.variantId} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm">{variant.title}</span>
              <span className="font-medium tabular-nums">
                {formatMoney(variant.resolved.price, currencyCode)}
              </span>
            </div>
            <PriceExplanation price={variant.resolved} />
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <p className="text-xs text-muted-foreground">and {pluralize(hidden, 'more variant')}</p>
      )}
    </div>
  );
}
