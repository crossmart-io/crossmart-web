import { ChevronDown, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PRICE_EXPLANATION_COPY, PRICE_WARNING_MESSAGES } from '../listings.constants';
import type { ResolvedPrice } from '../listings.types';
import { readablePriceExplanation } from '../price-explanation';

interface PriceExplanationProps {
  price: ResolvedPrice;
  /** Hides the formula behind a "How?" toggle, for lists where it would repeat. */
  onDemand?: boolean;
}

function PriceWarnings({ price }: { price: ResolvedPrice }) {
  return price.warnings.map((warning) => (
    <p key={warning} className="flex items-start gap-1.5 text-xs text-warning">
      <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
      {PRICE_WARNING_MESSAGES[warning]}
    </p>
  ));
}

function Formula({ price }: { price: ResolvedPrice }) {
  return (
    <p className="text-xs break-words text-muted-foreground tabular-nums">
      {readablePriceExplanation(price)}
    </p>
  );
}

/** The formula, shown once asked for; the button names what it reveals. */
function FormulaOnDemand({ price }: { price: ResolvedPrice }) {
  return (
    <Collapsible className="flex flex-col gap-1">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="link"
          size="xs"
          className="group h-auto self-start p-0 text-xs text-muted-foreground"
        >
          {PRICE_EXPLANATION_COPY.toggle}
          <ChevronDown
            data-icon="inline-end"
            className="transition-transform group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Formula price={price} />
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * How a channel price was reached, "$89.00 → +15% → .99 = $102.99", with conversion rates
 * rounded to read, and what to watch for. Warnings always show; the formula can wait to be asked.
 */
export function PriceExplanation({ price, onDemand = false }: PriceExplanationProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {onDemand ? <FormulaOnDemand price={price} /> : <Formula price={price} />}
      <PriceWarnings price={price} />
    </div>
  );
}
