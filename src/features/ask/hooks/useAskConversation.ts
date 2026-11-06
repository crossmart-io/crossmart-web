import { useCallback, useRef, useState } from 'react';
import { toAskFailure } from '../ask-failure';
import { type AskExchange, AskExchangeStatus } from '../ask.types';
import { useAskQuestion } from './useAskQuestion';

type ExchangeReply = Exclude<AskExchange, { status: AskExchangeStatus.Pending }>;

export interface AskConversation {
  exchanges: readonly AskExchange[];
  isAsking: boolean;
  ask: (question: string) => void;
}

/**
 * The questions asked in this session and their replies. Kept in component state only:
 * nothing is stored, and the conversation ends when the app is closed or reloaded.
 */
export function useAskConversation(): AskConversation {
  const [exchanges, setExchanges] = useState<AskExchange[]>([]);
  const nextId = useRef(0);
  const { mutateAsync, isPending } = useAskQuestion();

  const settle = useCallback((reply: ExchangeReply) => {
    setExchanges((current) =>
      current.map((exchange) => (exchange.id === reply.id ? reply : exchange)),
    );
  }, []);

  const ask = useCallback(
    (question: string) => {
      const id = nextId.current++;
      setExchanges((current) => [...current, { id, question, status: AskExchangeStatus.Pending }]);
      mutateAsync(question).then(
        (answer) => settle({ id, question, status: AskExchangeStatus.Answered, answer }),
        (error: unknown) =>
          settle({ id, question, status: AskExchangeStatus.Failed, ...toAskFailure(error) }),
      );
    },
    [mutateAsync, settle],
  );

  return { exchanges, isAsking: isPending, ask };
}
