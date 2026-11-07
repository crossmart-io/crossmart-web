import { AgentWorkerToolKind } from '@/api/schema';
import type { AgentWorkerAction, AgentWorkerMessage } from '../agent-worker.types';
import { isProposed } from '../conversation-view';
import { ActionList } from './ActionRow';
import { MessageBubble } from './MessageBubble';

/** Changes still waiting are shown in the review card, not under their message. */
function isShownInline(action: AgentWorkerAction): boolean {
  return action.kind === AgentWorkerToolKind.read || !isProposed(action);
}

/** A stored message: its text, then the tools it called. */
export function ConversationMessage({ message }: { message: AgentWorkerMessage }) {
  return (
    <li className="flex flex-col gap-1.5">
      {message.text && <MessageBubble role={message.role} text={message.text} />}
      <ActionList actions={message.actions.filter(isShownInline)} />
    </li>
  );
}
