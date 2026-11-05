import { WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ContentField } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GenerateAvailability, useGenerateAvailability } from '@/features/suggestions';
import { AI_WRITER_COPY, AI_WRITER_DONE } from '../ai-writer.constants';
import type { ContentDraft, ContentDraftCurrent, ContentDraftTarget } from '../ai-writer.types';
import { useContentDraft } from '../hooks/useContentDraft';
import { AiRewriteForm } from './AiRewriteForm';

export interface AiRewriteButtonProps {
  target: ContentDraftTarget;
  fields: readonly ContentField[];
  /** Read when asked, so the text being edited is what gets rewritten. */
  getCurrent: () => ContentDraftCurrent;
  /** Puts the draft in the form and returns how to put the previous text back. */
  apply: (draft: ContentDraft) => () => void;
  label?: string;
  /** An outlined button, for the main AI action of a section. */
  prominent?: boolean;
}

const SUBTLE_LOOK = { variant: 'ghost', size: 'xs' } as const;
const PROMINENT_LOOK = { variant: 'outline', size: 'sm' } as const;
type ButtonLook = typeof SUBTLE_LOOK | typeof PROMINENT_LOOK;

function doneMessage(fields: readonly ContentField[]): string {
  if (fields.length > 1) return AI_WRITER_DONE.both;
  return fields[0] === ContentField.title ? AI_WRITER_DONE.title : AI_WRITER_DONE.description;
}

/**
 * Rewrites fields in place with AI, optionally following an instruction. The text lands in
 * the form unsaved, with Undo. Hidden without the permission; disabled while AI is off.
 */
export function AiRewriteButton(props: AiRewriteButtonProps) {
  const { target, fields, getCurrent, apply, label = AI_WRITER_COPY.rewrite } = props;
  const look = props.prominent ? PROMINENT_LOOK : SUBTLE_LOOK;
  const availability = useGenerateAvailability();
  const draft = useContentDraft(target);
  const [open, setOpen] = useState(false);
  if (availability === GenerateAvailability.Hidden) return null;
  if (availability === GenerateAvailability.NotConfigured) {
    return <NotConfiguredButton label={label} look={look} />;
  }

  const submit = (instruction: string) => {
    draft.mutate(
      { fields, instruction, current: getCurrent() },
      {
        onSuccess: (written) => {
          const undo = apply(written);
          setOpen(false);
          toast.success(doneMessage(fields), {
            action: { label: AI_WRITER_COPY.undo, onClick: undo },
          });
        },
      },
    );
  };
  return (
    <Popover open={open} onOpenChange={(next) => (draft.isPending ? null : setOpen(next))}>
      <PopoverTrigger asChild>
        <Button type="button" {...look}>
          <WandSparkles data-icon="inline-start" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <AiRewriteForm isWriting={draft.isPending} error={draft.error} onSubmit={submit} />
      </PopoverContent>
    </Popover>
  );
}

function NotConfiguredButton({ label, look }: { label: string; look: ButtonLook }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A disabled button gets no pointer events, so the tooltip hangs on a wrapper. */}
        <span className="inline-flex w-fit">
          <Button type="button" {...look} disabled>
            <WandSparkles data-icon="inline-start" />
            {label}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{AI_WRITER_COPY.notConfigured}</TooltipContent>
    </Tooltip>
  );
}
