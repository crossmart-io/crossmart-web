import { Text } from 'lucide-react';
import { type KeyboardEvent, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const COMMIT_KEY = 'Enter';

interface AltTextPopoverProps {
  altText: string;
  /** How the image is named in the button label. */
  imageName: string;
  onChange: (altText: string) => void;
}

/** Edits an image's alt text. The draft is kept when the popover closes, by any means. */
export function AltTextPopover({ altText, imageName, onChange }: AltTextPopoverProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(altText);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setDraft(altText);
    else if (draft !== altText) onChange(draft.trim());
    setOpen(nextOpen);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== COMMIT_KEY) return;
    // Enter would submit the product form.
    event.preventDefault();
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          aria-label={`Edit alt text of ${imageName}`}
        >
          <Text />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-72 flex-col gap-2">
        <Label htmlFor={inputId}>Alt text</Label>
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image for screen readers and search"
        />
      </PopoverContent>
    </Popover>
  );
}
