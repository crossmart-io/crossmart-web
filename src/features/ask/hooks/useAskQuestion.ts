import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { ASK_ENDPOINT } from '../ask.constants';
import type { AskAnswer } from '../ask.types';

/** Sends one question to Ask Crossmart. Errors stay in the panel, not in a toast. */
export function useAskQuestion() {
  return useMutation<AskAnswer, Error, string>({
    meta: { inlineError: true },
    mutationFn: (question) => unwrap(fetchClient.POST(ASK_ENDPOINT, { body: { question } })),
  });
}
