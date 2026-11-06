import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ASK_COPY } from '../ask.constants';
import { useAskConversation } from '../hooks/useAskConversation';
import { AskPanel } from './AskPanel';

/**
 * The Help button in the app header. The conversation lives here, not in the sheet, so it
 * survives closing and reopening the sheet, and a reply still lands if the sheet was closed.
 */
export function AskLauncher() {
  const conversation = useAskConversation();
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={ASK_COPY.launcher}>
              <CircleHelp />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>{ASK_COPY.launcher}</TooltipContent>
      </Tooltip>
      <AskPanel {...conversation} />
    </Sheet>
  );
}
