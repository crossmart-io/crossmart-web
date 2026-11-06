import { PageSection } from '@/config/routes';
import { useFormContext, useWatch } from 'react-hook-form';
import { pluralize } from '@/lib/format';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { OptionsEditor } from './OptionsEditor';
import { VariantsGrid } from './VariantsGrid';

export function VariantsCard({ currency }: { currency: string }) {
  const { control } = useFormContext<ProductFormValues>();
  const options = useWatch({ control, name: 'options' });
  const variantCount = useWatch({ control, name: 'variants' }).length;
  const hasOptions = options.some((option) => option.values.length > 0);

  return (
    <EditorCard
      title="Variants"
      id={PageSection.ProductVariants}
      action={
        hasOptions && (
          <span className="text-sm text-muted-foreground">
            {pluralize(variantCount, 'variant')}
          </span>
        )
      }
    >
      <OptionsEditor />
      {hasOptions && <VariantsGrid currency={currency} />}
    </EditorCard>
  );
}
