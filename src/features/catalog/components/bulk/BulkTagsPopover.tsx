import { Tags } from 'lucide-react';
import { useId, useState } from 'react';
import { TagInput } from '@/components/forms/TagInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BulkTagsPopoverProps {
  disabled: boolean;
  onAdd: (tags: string[]) => void;
  onRemove: (tags: string[]) => void;
}

/** Type tags once, then add them to every selected product or take them off. */
export function BulkTagsPopover({ disabled, onAdd, onRemove }: BulkTagsPopoverProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  function run(action: (tags: string[]) => void) {
    action(tags);
    setTags([]);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Tags data-icon="inline-start" />
          Tags
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-3">
        <Label htmlFor={inputId}>Tags</Label>
        <TagInput
          id={inputId}
          value={tags}
          onChange={setTags}
          placeholder="Type a tag and press Enter"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={tags.length === 0}
            onClick={() => run(onRemove)}
          >
            Remove
          </Button>
          <Button size="sm" disabled={tags.length === 0} onClick={() => run(onAdd)}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
