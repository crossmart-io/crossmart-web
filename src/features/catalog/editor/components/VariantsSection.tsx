import { PageSection } from '@/config/routes';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ProductFormValues } from '../product-form.schema';
import { EditorSection } from './EditorSection';
import { OptionsEditor } from './OptionsEditor';
import { VariantsGrid } from './VariantsGrid';

/** Options such as size or color, and a row of price and stock per variant. */
export function VariantsSection({ currency }: { currency: string }) {
  const { control } = useFormContext<ProductFormValues>();
  const options = useWatch({ control, name: 'options' });
  const variantCount = useWatch({ control, name: 'variants' }).length;
  const hasOptions = options.some((option) => option.values.length > 0);
  const title = hasOptions ? `Variants (${variantCount.toLocaleString()})` : 'Variants';
  return (
    <EditorSection title={title} id={PageSection.ProductVariants}>
      <OptionsEditor />
      {hasOptions && <VariantsGrid currency={currency} />}
    </EditorSection>
  );
}
