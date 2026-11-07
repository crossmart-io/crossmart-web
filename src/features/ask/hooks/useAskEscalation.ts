import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { useMe } from '@/features/workspaces';
import { ASK_ESCALATIONS_ENDPOINT } from '../ask.constants';
import type { OpenedAskEscalation } from '../ask.types';

/** Handing the panel's conversation to a person, and where that stands. */
export interface AskEscalation {
  /** Hands the conversation over; the reply goes to the signed-in user's email. */
  request: () => void;
  isPending: boolean;
  /** The conversation was handed over; the reply goes to `contactEmail`. */
  isSent: boolean;
  error: Error | null;
  contactEmail: string | undefined;
  /** Forgets the hand-off, for a new conversation. */
  reset: () => void;
}

/** Hands `conversationId` to the Crossmart team, who reply to the signed-in user by email. */
export function useAskEscalation(conversationId: string | undefined): AskEscalation {
  const contactEmail = useMe().data?.email;
  const mutation = useMutation<OpenedAskEscalation, Error, string>({
    meta: { inlineError: true },
    mutationFn: (id) =>
      unwrap(
        fetchClient.POST(ASK_ESCALATIONS_ENDPOINT, { body: { conversationId: id, contactEmail } }),
      ),
  });
  const { mutate, reset } = mutation;
  const isCurrent = mutation.variables === conversationId;
  const request = useCallback(() => {
    if (conversationId) mutate(conversationId);
  }, [conversationId, mutate]);
  return {
    request,
    isPending: mutation.isPending,
    isSent: isCurrent && mutation.isSuccess,
    error: isCurrent ? mutation.error : null,
    contactEmail,
    reset,
  };
}
