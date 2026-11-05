import { PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useGenerateContent } from '../hooks/useGenerateContent';
import { GenerateAvailability, useGenerateAvailability } from '../hooks/useGenerateAvailability';
import { AI_COPY } from '../suggestions.constants';

interface GenerateWithAiButtonProps {
  workspaceId: string;
  connectionId: string;
  productId: string;
}

/**
 * Asks AI for a title and description for one product on one store. Hidden without the
 * permission, and disabled with the reason while AI is not configured.
 */
export function GenerateWithAiButton({
  workspaceId,
  connectionId,
  productId,
}: GenerateWithAiButtonProps) {
  const availability = useGenerateAvailability();
  const generate = useGenerateContent(workspaceId);
  if (availability === GenerateAvailability.Hidden) return null;
  const notConfigured = availability === GenerateAvailability.NotConfigured;
  const button = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={notConfigured || generate.isPending}
      onClick={() => generate.mutate({ connectionId, productIds: [productId] })}
    >
      {generate.isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <PenLine data-icon="inline-start" />
      )}
      {AI_COPY.generate}
    </Button>
  );
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A disabled button gets no pointer events, so the tooltip hangs on a wrapper. */}
        <span className="inline-flex w-fit">{button}</span>
      </TooltipTrigger>
      <TooltipContent>
        {notConfigured ? AI_COPY.notConfiguredTitle : AI_COPY.generateHint}
      </TooltipContent>
    </Tooltip>
  );
}
