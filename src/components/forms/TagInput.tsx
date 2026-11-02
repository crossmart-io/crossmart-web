import { X } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { cn } from 'cn';

/** Keys that turn the typed text into a tag. */
const COMMIT_KEYS = new Set(['Enter', ',']);
const REMOVE_LAST_KEY = 'Backspace';

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  'aria-invalid'?: boolean;
}

/** Free-text chips: type and press Enter or comma; Backspace removes the last one. */
export function TagInput({ id, value, onChange, placeholder, ...props }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function commit() {
    const tag = draft.trim();
    setDraft('');
    if (!tag || value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (COMMIT_KEYS.has(event.key)) {
      event.preventDefault();
      commit();
    } else if (event.key === REMOVE_LAST_KEY && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        props['aria-invalid'] && 'border-destructive',
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((existing) => existing !== tag))}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        aria-invalid={props['aria-invalid']}
      />
    </div>
  );
}
