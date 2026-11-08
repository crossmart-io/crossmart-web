import { AGENT_WORKER_ELEMENT_IDS } from '@/features/agent-worker';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Brings the changes waiting for review into view in the chat, and moves the focus there. */
export function scrollToProposals(): void {
  const card = document.getElementById(AGENT_WORKER_ELEMENT_IDS.proposedCard);
  if (!card) return;
  const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  card.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  card.focus({ preventScroll: true });
}
