import { Text } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AltTextPopoverProps {
  altText: string;
  onChange: (altText: string) => void;
}

export function AltTextPopover({ altText, onChange }: AltTextPopoverProps) {
  const inputId = useId();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-7"
          aria-label="Edit alt text"
        >
          <Text />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-72 flex-col gap-2">
        <Label htmlFor={inputId}>Alt text</Label>
        <Input
          id={inputId}
          defaultValue={altText}
          placeholder="Describe the image for screen readers and search"
          onBlur={(event) => onChange(event.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
