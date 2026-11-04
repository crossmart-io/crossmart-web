import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MAX_OPTIONS, type ProductFormValues } from '../product-form.schema';
import { syncVariants } from '../variant-sync';
import { OptionRow } from './OptionRow';

/** Option suggestions in the order sellers usually add them. */
const SUGGESTED_OPTION_NAMES = ['Size', 'Color', 'Material'] as const;

/** Option names and values. Any change regenerates the variant rows, keeping existing ones. */
export function OptionsEditor() {
  const { control, getValues, setValue } = useFormContext<ProductFormValues>();
  const options = useFieldArray({ control, name: 'options' });

  function regenerateVariants() {
    const { options: current, variants } = getValues();
    setValue('variants', syncVariants(current, variants), { shouldDirty: true });
  }

  function addOption() {
    const used = new Set(getValues('options').map((option) => option.name.toLowerCase()));
    const name = SUGGESTED_OPTION_NAMES.find((suggestion) => !used.has(suggestion.toLowerCase()));
    options.append({ name: name ?? '', values: [] });
  }

  return (
    <div className="flex flex-col gap-3">
      {options.fields.map((option, index) => (
        <OptionRow
          key={option.id}
          index={index}
          onValuesChange={regenerateVariants}
          onRemove={() => {
            options.remove(index);
            regenerateVariants();
          }}
        />
      ))}
      {options.fields.length < MAX_OPTIONS && (
        <Button type="button" variant="outline" className="w-fit" onClick={addOption}>
          <Plus />
          {options.fields.length === 0 ? 'Add options like size or color' : 'Add another option'}
        </Button>
      )}
    </div>
  );
}
