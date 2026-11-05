import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';
import { CategoryAspectMode } from '@/api/schema';
import { ITEM_SPECIFICS_COPY } from '../listings.constants';
import type { CategoryAspect } from '../listings.types';
import { MultiValueInput, SelectValueInput, TextValueInput } from './ItemSpecificInputs';

const FIELD_ID_PREFIX = 'item-specific-';
const NON_ID_CHARACTERS = /[^a-z0-9]+/gi;

interface ItemSpecificFieldProps {
  aspect: CategoryAspect;
  values: readonly string[];
  onChange: (values: string[]) => void;
}

function fieldId(name: string): string {
  return `${FIELD_ID_PREFIX}${name.replace(NON_ID_CHARACTERS, '-').toLowerCase()}`;
}

/** The input an aspect calls for: chips for several values, a select for eBay's values only. */
function AspectInput({ aspect, values, onChange, id }: ItemSpecificFieldProps & { id: string }) {
  const selectionOnly = aspect.mode === CategoryAspectMode.selection_only;
  const common = { id, label: aspect.name, options: aspect.values };
  if (aspect.multiple) {
    return (
      <MultiValueInput
        {...common}
        values={values}
        onChange={onChange}
        selectionOnly={selectionOnly}
      />
    );
  }
  const Single = selectionOnly && aspect.values.length > 0 ? SelectValueInput : TextValueInput;
  return (
    <Single
      {...common}
      value={values[0] ?? ''}
      onChange={(value) => onChange(value ? [value] : [])}
    />
  );
}

/** One item specific: its name, whether eBay requires it, and its value or values. */
export function ItemSpecificField(props: ItemSpecificFieldProps) {
  const id = fieldId(props.aspect.name);
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {props.aspect.name}
        {props.aspect.required && <Badge variant="outline">{ITEM_SPECIFICS_COPY.required}</Badge>}
      </FieldLabel>
      <AspectInput {...props} id={id} />
    </Field>
  );
}
