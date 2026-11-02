import { EditorCard } from './EditorCard';
import { MoneyField } from './FormFields';

/** Price of a product without options (its only variant). */
export function PricingCard({ currency }: { currency: string }) {
  return (
    <EditorCard title="Pricing">
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField name="variants.0.price" label="Price" currency={currency} />
        <MoneyField
          name="variants.0.compareAtPrice"
          label="Compare-at price"
          currency={currency}
          description="The original price, shown crossed out."
        />
      </div>
    </EditorCard>
  );
}
