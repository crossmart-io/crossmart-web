import { useCallback, useMemo, useState } from 'react';
import { AgentWorkerTurnStatus } from '@/api/schema';
import { buildConversationView, type ConversationView } from '../conversation-view';
import type {
  AgentWorkerConversationDetail,
  AgentWorkerDecision,
  AgentWorkerPageContext,
  OpenAgentWorkerOptions,
} from '../agent-worker.types';
import type { LiveTurnState } from '../live-turn';
import {
  useAgentWorkerConversation,
  useCancelAgentWorkerTurn,
  useCreateAgentWorkerConversation,
} from './useAgentWorkerConversations';
import { TurnRequestKind, useAgentWorkerTurn } from './useAgentWorkerTurn';

export interface AgentWorkerSession {
  workspaceId: string;
  conversationId: string | null;
  detail: ReturnType<typeof useAgentWorkerConversation>;
  view: ConversationView;
  live: LiveTurnState;
  /** A turn is streaming here, or one started elsewhere is still running. */
  isBusy: boolean;
  isStreaming: boolean;
  draft: string;
  setDraft: (draft: string) => void;
  send: (text: string) => void;
  decide: (decision: AgentWorkerDecision) => void;
  stop: () => void;
  selectConversation: (conversationId: string | null) => void;
  /** Applies how a page opened the panel: its context, and text for the composer. */
  prepare: (options: OpenAgentWorkerOptions) => void;
}

function isRunning(detail: AgentWorkerConversationDetail | undefined): boolean {
  return detail?.activeTurn?.status === AgentWorkerTurnStatus.running;
}

/**
 * Which conversation is open, what is typed, and the page it is about. Another conversation
 * calls `reset`, which drops the turn streaming into the one before.
 */
function useSessionState(reset: () => void) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [pageContext, setPageContext] = useState<AgentWorkerPageContext>();

  const selectConversation = useCallback(
    (id: string | null) => {
      reset();
      setConversationId(id);
    },
    [reset],
  );

  const prepare = useCallback(
    ({ context, prefill }: OpenAgentWorkerOptions) => {
      setPageContext(context);
      if (prefill === undefined) return;
      selectConversation(null);
      setDraft(prefill);
    },
    [selectConversation],
  );

  return {
    conversationId,
    setConversationId,
    draft,
    setDraft,
    pageContext,
    selectConversation,
    prepare,
  };
}

/**
 * Everything the Agent Worker panel does for one workspace: the open conversation, merged with
 * the turn streaming into it, and the ways to send, decide and stop. A first message starts a
 * conversation, and a page that opens the panel with text starts a new one.
 */
export function useAgentWorkerSession(workspaceId: string): AgentWorkerSession {
  const turn = useAgentWorkerTurn(workspaceId);
  const { live, start, abort, reset } = turn;
  const state = useSessionState(reset);
  const { conversationId, setConversationId, setDraft, pageContext } = state;
  const detail = useAgentWorkerConversation(workspaceId, conversationId);
  const create = useCreateAgentWorkerConversation(workspaceId);
  const { mutateAsync: createConversation } = create;
  const { mutate: cancelTurn } = useCancelAgentWorkerTurn(workspaceId);
  const view = useMemo(
    () => buildConversationView(detail.data?.messages ?? [], live),
    [detail.data, live],
  );

  const send = useCallback(
    async (text: string) => {
      setDraft('');
      const restoreDraft = () => setDraft(text);
      const id = conversationId ?? (await createConversation().catch(() => null))?.id;
      if (!id) return restoreDraft();
      setConversationId(id);
      const body = { text, context: pageContext };
      start({ kind: TurnRequestKind.Message, conversationId: id, body }, { onError: restoreDraft });
    },
    [conversationId, createConversation, pageContext, setConversationId, setDraft, start],
  );

  const decide = useCallback(
    (decision: AgentWorkerDecision) => {
      if (!conversationId) return;
      start({ kind: TurnRequestKind.Decision, conversationId, body: decision });
    },
    [conversationId, start],
  );

  const stop = useCallback(() => {
    if (conversationId) cancelTurn(conversationId);
    abort();
  }, [abort, cancelTurn, conversationId]);

  return {
    workspaceId,
    conversationId,
    draft: state.draft,
    setDraft,
    detail,
    view,
    live,
    isBusy: turn.isStreaming || create.isPending || isRunning(detail.data),
    isStreaming: turn.isStreaming,
    send: (text) => void send(text),
    decide,
    stop,
    selectConversation: state.selectConversation,
    prepare: state.prepare,
  };
}
