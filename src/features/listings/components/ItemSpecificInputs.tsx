import { X } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ITEM_SPECIFICS_COPY, VALUE_SEPARATOR_KEYS } from '../listings.constants';

interface ValueInputProps {
  id: string;
  label: string;
  /** The channel's values: the only choices, or suggestions for free text. */
  options: readonly string[];
}

interface SingleValueProps extends ValueInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface MultiValueProps extends ValueInputProps {
  values: readonly string[];
  onChange: (values: string[]) => void;
  /** Whether only `options` may be added. */
  selectionOnly: boolean;
}

/** eBay's values offered while typing, through the browser's own suggestion list. */
function Suggestions({ id, options }: { id: string; options: readonly string[] }) {
  if (options.length === 0) return null;
  return (
    <datalist id={id}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </datalist>
  );
}

/** Free text, with eBay's values as suggestions. */
export function TextValueInput({ id, label, options, value, onChange }: SingleValueProps) {
  const listId = `${id}-values`;
  return (
    <>
      <Input
        id={id}
        aria-label={label}
        list={options.length > 0 ? listId : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Suggestions id={listId} options={options} />
    </>
  );
}

/** One of eBay's values, or none. */
export function SelectValueInput({ id, label, options, value, onChange }: SingleValueProps) {
  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} className="w-full">
          <SelectValue placeholder={ITEM_SPECIFICS_COPY.choose} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <Button type="button" variant="ghost" onClick={() => onChange('')}>
          {ITEM_SPECIFICS_COPY.clear}
        </Button>
      )}
    </div>
  );
}

function ValueChips({
  label,
  values,
  onRemove,
}: {
  label: string;
  values: readonly string[];
  onRemove: (value: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <ul
      className="flex flex-wrap gap-1"
      aria-label={`${label} ${ITEM_SPECIFICS_COPY.valuesSuffix}`}
    >
      {values.map((value) => (
        <li key={value}>
          <Badge variant="secondary" className="gap-1 pr-1">
            {value}
            <button
              type="button"
              className="rounded-sm opacity-70 hover:opacity-100"
              aria-label={`${ITEM_SPECIFICS_COPY.removeValue} ${value}`}
              onClick={() => onRemove(value)}
            >
              <X className="size-3" />
            </button>
          </Badge>
        </li>
      ))}
    </ul>
  );
}

interface AdderProps {
  onAdd: (value: string) => void;
}

/** Typed values, each added on Enter or comma, with eBay's values as suggestions. */
function TypedValueAdder({ id, label, options, onAdd }: ValueInputProps & AdderProps) {
  const [draft, setDraft] = useState('');
  const listId = `${id}-values`;
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter adds the value; it must not submit the override form around the section.
    if (!VALUE_SEPARATOR_KEYS.includes(event.key)) return;
    event.preventDefault();
    onAdd(draft);
    setDraft('');
  };
  return (
    <>
      <Input
        id={id}
        aria-label={label}
        placeholder={ITEM_SPECIFICS_COPY.addValue}
        list={options.length > 0 ? listId : undefined}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          onAdd(draft);
          setDraft('');
        }}
      />
      <Suggestions id={listId} options={options} />
    </>
  );
}

/** One of eBay's values at a time, for selection-only aspects with several values. */
function SelectedValueAdder({ id, label, options, onAdd }: ValueInputProps & AdderProps) {
  return (
    <Select value="" onValueChange={onAdd}>
      <SelectTrigger id={id} aria-label={label} className="w-full">
        <SelectValue placeholder={ITEM_SPECIFICS_COPY.addValue} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Several values, shown as chips. */
export function MultiValueInput({ values, onChange, selectionOnly, ...input }: MultiValueProps) {
  const add = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
  };
  const Adder = selectionOnly ? SelectedValueAdder : TypedValueAdder;
  return (
    <div className="flex flex-col gap-2">
      <ValueChips
        label={input.label}
        values={values}
        onRemove={(removed) => onChange(values.filter((value) => value !== removed))}
      />
      <Adder
        {...input}
        options={input.options.filter((option) => !values.includes(option))}
        onAdd={add}
      />
    </div>
  );
}
