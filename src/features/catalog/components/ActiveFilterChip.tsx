import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

/** A filter that came from a link, shown so the user knows why the list is shorter. */
export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  return (
    <Badge variant="secondary" className="h-7 gap-1.5 pr-1 pl-2.5 text-sm">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="grid size-5 place-items-center rounded-full hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="size-3.5" />
      </button>
    </Badge>
  );
}
