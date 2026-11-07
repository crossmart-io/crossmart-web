import { useCallback, useRef, useState } from 'react';
import { isNotFoundError } from '@/api/api-error';
import { toAskFailure } from '../ask-failure';
import { type AskAnswer, type AskExchange, AskExchangeStatus } from '../ask.types';
import { type AskEscalation, useAskEscalation } from './useAskEscalation';
import { useAskQuestion } from './useAskQuestion';

type ExchangeReply = Exclude<AskExchange, { status: AskExchangeStatus.Pending }>;

export interface AskConversation {
  exchanges: readonly AskExchange[];
  isAsking: boolean;
  ask: (question: string) => void;
  /** Clears the panel; the next question starts a new conversation. */
  startOver: () => void;
  /** Handing this conversation to a person, when an answer offers one. */
  escalation: AskEscalation;
}

/**
 * The questions asked in the panel and their replies. Each answer carries the conversation's id,
 * which the next question sends back so Ask answers it as a follow-up. The exchanges live in
 * component state only, and end when the user starts over or the app is reloaded.
 */
export function useAskConversation(): AskConversation {
  const [exchanges, setExchanges] = useState<AskExchange[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const nextId = useRef(0);
  // Bumped on start over, so a reply to the previous conversation is dropped.
  const generation = useRef(0);
  const { mutateAsync, isPending } = useAskQuestion();
  const escalation = useAskEscalation(conversationId);

  const settle = useCallback((reply: ExchangeReply) => {
    setExchanges((current) =>
      current.map((exchange) => (exchange.id === reply.id ? reply : exchange)),
    );
  }, []);

  const ask = useCallback(
    (question: string) => {
      const id = nextId.current++;
      const askedIn = generation.current;
      const isStale = () => askedIn !== generation.current;
      setExchanges((current) => [...current, { id, question, status: AskExchangeStatus.Pending }]);
      mutateAsync({ question, conversationId }).then(
        (answer: AskAnswer) => {
          if (isStale()) return;
          setConversationId(answer.conversationId);
          settle({ id, question, status: AskExchangeStatus.Answered, answer });
        },
        (error: unknown) => {
          if (isStale()) return;
          // The conversation expired: the next question starts a new one.
          if (isNotFoundError(error)) setConversationId(undefined);
          settle({ id, question, status: AskExchangeStatus.Failed, ...toAskFailure(error) });
        },
      );
    },
    [conversationId, mutateAsync, settle],
  );

  const { reset: resetEscalation } = escalation;
  const startOver = useCallback(() => {
    generation.current++;
    setExchanges([]);
    setConversationId(undefined);
    resetEscalation();
  }, [resetEscalation]);

  return { exchanges, isAsking: isPending, ask, startOver, escalation };
}
