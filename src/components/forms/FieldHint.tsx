import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FieldHintProps {
  /** What the field is for, read out by screen readers and shown on hover or focus. */
  text: string;
}

/** A small help mark beside a label, so helper text stays out of the way until it is wanted. */
export function FieldHint({ text }: FieldHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-grid size-5 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CircleHelp className="size-3.5" aria-hidden="true" />
          <span className="sr-only">{text}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{text}</TooltipContent>
    </Tooltip>
  );
}
