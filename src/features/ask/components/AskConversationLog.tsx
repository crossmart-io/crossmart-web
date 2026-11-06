import { useEffect, useRef } from 'react';
import type { AskConversation } from '../hooks/useAskConversation';
import { AskExchangeItem } from './AskExchangeItem';
import { AskSuggestions } from './AskSuggestions';

/**
 * The questions and replies so far, newest at the bottom. A polite live region, so a screen
 * reader reads each reply when it arrives without interrupting the person.
 */
export function AskConversationLog({ exchanges, isAsking, ask }: AskConversation) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [exchanges]);

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      aria-busy={isAsking}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-2"
    >
      {exchanges.length ? (
        <ol className="flex flex-col gap-6">
          {exchanges.map((exchange) => (
            <AskExchangeItem key={exchange.id} exchange={exchange} />
          ))}
        </ol>
      ) : (
        <AskSuggestions disabled={isAsking} onAsk={ask} />
      )}
    </div>
  );
}
