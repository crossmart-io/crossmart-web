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
import {
  FILE_IMPORT_MODE_COPY,
  FILE_IMPORT_MODES,
  type FileImportMode,
} from '../imports.constants';

interface ImportModePickerProps {
  value: FileImportMode;
  onChange: (mode: FileImportMode) => void;
}

const MODE_INPUT_ID_PREFIX = 'import-mode-';

function toInputId(mode: FileImportMode): string {
  return `${MODE_INPUT_ID_PREFIX}${mode}`;
}

function toMode(value: string): FileImportMode | undefined {
  return FILE_IMPORT_MODES.find((mode) => mode === value);
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
        {FILE_IMPORT_MODES.map((mode) => (
          <FieldLabel key={mode} htmlFor={toInputId(mode)}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{FILE_IMPORT_MODE_COPY[mode].label}</FieldTitle>
                <FieldDescription>{FILE_IMPORT_MODE_COPY[mode].summary}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={mode} id={toInputId(mode)} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
