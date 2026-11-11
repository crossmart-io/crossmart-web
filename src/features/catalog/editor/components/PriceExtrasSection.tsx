import { COST_HELP, COMPARE_AT_HELP } from '../../catalog.constants';
import { EditorSection } from './EditorSection';
import { MoneyField } from './FormFields';

/** The prices beside the selling price, of a product without options (its only variant). */
export function PriceExtrasSection({ currency }: { currency: string }) {
  return (
    <EditorSection title="Pricing">
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          name="variants.0.compareAtPrice"
          label="Compare-at price"
          currency={currency}
          hint={COMPARE_AT_HELP}
        />
        <MoneyField name="variants.0.cost" label="Cost" currency={currency} hint={COST_HELP} />
      </div>
    </EditorSection>
  );
}
