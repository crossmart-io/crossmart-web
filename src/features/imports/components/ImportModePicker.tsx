import type { CatalogImportMode } from '@/api/schema';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IMPORT_MODE_COPY, IMPORT_MODE_OPTIONS } from '../imports.constants';

interface ImportModePickerProps {
  value: CatalogImportMode;
  onChange: (mode: CatalogImportMode) => void;
}

const MODE_INPUT_ID_PREFIX = 'import-mode-';

function toInputId(mode: CatalogImportMode): string {
  return `${MODE_INPUT_ID_PREFIX}${mode}`;
}

function toMode(value: string): CatalogImportMode | undefined {
  return IMPORT_MODE_OPTIONS.find((mode) => mode === value);
}

/** What the file should do, as choice cards. */
export function ImportModePicker({ value, onChange }: ImportModePickerProps) {
  return (
    <FieldSet>
      <FieldLegend variant="label">What should this file do?</FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={(next) => {
          const mode = toMode(next);
          if (mode) onChange(mode);
        }}
      >
        {IMPORT_MODE_OPTIONS.map((mode) => (
          <FieldLabel key={mode} htmlFor={toInputId(mode)}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{IMPORT_MODE_COPY[mode].label}</FieldTitle>
                <FieldDescription>{IMPORT_MODE_COPY[mode].summary}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={mode} id={toInputId(mode)} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
