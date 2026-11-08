import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { streamAgentWorkerTurn, toApiUrl } from '../agent-worker-stream';
import {
  AGENT_WORKER_DECISION_ENDPOINT,
  AGENT_WORKER_MESSAGES_ENDPOINT,
  AGENT_WORKER_REFRESHED_ENDPOINTS,
} from '../agent-worker.constants';
import type { AgentWorkerDecision, SendAgentWorkerMessage } from '../agent-worker.types';
import {
  INITIAL_LIVE_TURN,
  LiveTurnActionType,
  type LiveTurnState,
  liveTurnReducer,
} from '../live-turn';

/** What starts a turn: a new message, or a decision on the changes waiting. */
export enum TurnRequestKind {
  Message = 'message',
  Decision = 'decision',
}

export type TurnRequest = { conversationId: string } & (
  | { kind: TurnRequestKind.Message; body: SendAgentWorkerMessage }
  | { kind: TurnRequestKind.Decision; body: AgentWorkerDecision }
);

const TURN_ENDPOINTS: Record<TurnRequestKind, string> = {
  [TurnRequestKind.Message]: AGENT_WORKER_MESSAGES_ENDPOINT,
  [TurnRequestKind.Decision]: AGENT_WORKER_DECISION_ENDPOINT,
};

export interface AgentWorkerTurnStream {
  live: LiveTurnState;
  isStreaming: boolean;
  start: (request: TurnRequest, options?: { onError?: () => void }) => void;
  /** Stops reading the stream; the API stops the turn once the client is gone. */
  abort: () => void;
  /** Stops any stream and forgets it, for another conversation. */
  reset: () => void;
}

/**
 * Runs one Agent Worker turn at a time over its event stream, folding each event into the live
 * state. When the stream ends, the conversation and the list are refetched, and only then is
 * the live state dropped, so the panel goes from streamed to stored without a flicker. A refusal
 * before the stream opened (402, 409, 429…) fails the mutation, which the app shows as a toast.
 */
export function useAgentWorkerTurn(workspaceId: string): AgentWorkerTurnStream {
  const [live, dispatch] = useReducer(liveTurnReducer, INITIAL_LIVE_TURN);
  const controller = useRef<AbortController | null>(null);
  const refresh = useInvalidateEndpoints(AGENT_WORKER_REFRESHED_ENDPOINTS);

  const mutation = useMutation<void, Error, TurnRequest>({
    mutationFn: async (request) => {
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      const userText = request.kind === TurnRequestKind.Message ? request.body.text : undefined;
      dispatch({ type: LiveTurnActionType.Start, userText });
      try {
        await streamAgentWorkerTurn({
          url: toApiUrl(TURN_ENDPOINTS[request.kind], {
            workspaceId,
            conversationId: request.conversationId,
          }),
          body: request.body,
          signal: current.signal,
          onEvent: (event) => dispatch({ type: LiveTurnActionType.Event, event }),
        });
      } finally {
        // A stream replaced by a newer one, or by another conversation, leaves the state alone.
        if (controller.current === current) {
          await refresh();
          dispatch({ type: LiveTurnActionType.Settle });
        }
      }
    },
  });

  useEffect(() => () => controller.current?.abort(), []);

  const abort = useCallback(() => controller.current?.abort(), []);
  const reset = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    dispatch({ type: LiveTurnActionType.Reset });
  }, []);
  const { mutate } = mutation;
  const start = useCallback<AgentWorkerTurnStream['start']>(
    (request, options) => mutate(request, { onError: options?.onError }),
    [mutate],
  );

  return { live, isStreaming: mutation.isPending, start, abort, reset };
}
