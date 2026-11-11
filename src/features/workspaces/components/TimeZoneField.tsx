import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { timeZoneChoices } from '../time-zones';

const FIELD_ID = 'workspace-time-zone';

interface TimeZoneFieldProps {
  label: string;
  value: string;
  onChange: (zone: string) => void;
  description?: string;
}

/** Where the workspace's day starts: reports count days, weeks and months in this zone. */
export function TimeZoneField({ label, value, onChange, description }: TimeZoneFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={FIELD_ID}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={FIELD_ID} className="w-full sm:w-80">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {timeZoneChoices().map((choice) => (
            <SelectItem key={choice} value={choice}>
              {choice}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
