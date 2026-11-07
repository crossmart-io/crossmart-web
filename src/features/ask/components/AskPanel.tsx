import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ASK_COPY } from '../ask.constants';
import type { AskConversation } from '../hooks/useAskConversation';
import { AskConversationLog } from './AskConversationLog';
import { AskForm } from './AskForm';

/** The help sheet: what the assistant is, the conversation, and the question box. */
export function AskPanel(conversation: AskConversation) {
  return (
    <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
      <SheetHeader className="border-b pe-12">
        <SheetTitle>{ASK_COPY.title}</SheetTitle>
        <SheetDescription>{ASK_COPY.description}</SheetDescription>
        {conversation.exchanges.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ms-2 self-start"
            disabled={conversation.isAsking}
            onClick={conversation.startOver}
          >
            <RotateCcw data-icon="inline-start" />
            {ASK_COPY.startOver}
          </Button>
        )}
      </SheetHeader>
      <AskConversationLog {...conversation} />
      <AskForm isAsking={conversation.isAsking} onAsk={conversation.ask} />
    </SheetContent>
  );
}
