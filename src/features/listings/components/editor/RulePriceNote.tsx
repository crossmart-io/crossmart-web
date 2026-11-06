import { formatMoney } from '@/lib/format';
import { LISTING_EDITOR_COPY } from '../../listings.constants';

interface RulePriceNoteProps {
  /** What the store's pricing rule charges, in the store's currency. */
  rulePrice: string;
  currency: string;
}

/** The pricing rule's price, shown beside a price the store sets itself: "Rule price $62.00". */
export function RulePriceNote({ rulePrice, currency }: RulePriceNoteProps) {
  return (
    <p className="text-xs text-muted-foreground">
      {LISTING_EDITOR_COPY.rulePrice(formatMoney(rulePrice, currency))}
    </p>
  );
}
