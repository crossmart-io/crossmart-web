import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

/** A list's search box. Pair it with `useDebouncedSearchParam` to keep it in the URL. */
export function SearchInput({ value, onChange, placeholder, label }: SearchInputProps) {
  return (
    <InputGroup className="sm:w-72">
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        spellCheck={false}
      />
    </InputGroup>
  );
}
