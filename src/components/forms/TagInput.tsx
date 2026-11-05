import { X } from 'lucide-react';
import { type KeyboardEvent, useId, useState } from 'react';
import { cn } from '@/lib/utils';

/** Keys that turn the typed text into a tag. */
const COMMIT_KEYS = new Set(['Enter', ',']);
const REMOVE_LAST_KEY = 'Backspace';

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Ids of descriptions or errors that explain the field. */
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

/**
 * Free-text chips: type and press Enter or comma; Backspace removes the last one.
 * Additions and removals are announced, since a chip appearing says nothing to a screen reader.
 */
export function TagInput({ id, value, onChange, placeholder, ...aria }: TagInputProps) {
  const instructionsId = useId();
  const [draft, setDraft] = useState('');
  const [announcement, setAnnouncement] = useState('');

  function commit() {
    const tag = draft.trim();
    setDraft('');
    if (!tag || value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
    setAnnouncement(`Added ${tag}`);
  }

  function remove(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
    setAnnouncement(`Removed ${tag}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const lastTag = value.at(-1);
    if (COMMIT_KEYS.has(event.key)) {
      event.preventDefault();
      commit();
    } else if (event.key === REMOVE_LAST_KEY && !draft && lastTag) {
      remove(lastTag);
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        aria['aria-invalid'] && 'border-destructive',
      )}
    >
      {value.map((tag) => (
        <TagChip key={tag} tag={tag} onRemove={() => remove(tag)} />
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="h-6 min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        aria-invalid={aria['aria-invalid']}
        aria-describedby={[instructionsId, aria['aria-describedby']].filter(Boolean).join(' ')}
      />
      {/* The placeholder disappears after the first tag; these instructions stay. */}
      <span id={instructionsId} className="sr-only">
        Press Enter or comma to add. Backspace removes the last one.
      </span>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

/** One tag, with a 24px remove target. */
function TagChip({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-muted py-0.5 pr-0.5 pl-2 text-xs font-medium">
      {tag}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={`Remove ${tag}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}
