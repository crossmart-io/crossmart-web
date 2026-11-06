import { ActivityActorType } from '@/api/schema';
import { APP_NAME } from '@/config/app';
import type { ActivityActor } from './activity.types';

/** Shown when the user or key that acted has since been deleted. */
const DELETED_ACTOR_NAMES: Record<ActivityActorType, string> = {
  [ActivityActorType.USER]: 'Deleted user',
  [ActivityActorType.API_KEY]: 'Deleted API key',
  [ActivityActorType.AGENT]: 'Deleted user',
  [ActivityActorType.SYSTEM]: APP_NAME,
};

/** Shown for an agent whose registration is gone. */
const UNKNOWN_AGENT_NAME = 'An AI agent';

/** Who acted: the user, the key, or, for an agent, the agent's own name. */
export function toActorName(actor: ActivityActor): string {
  if (actor.type === ActivityActorType.SYSTEM) return APP_NAME;
  if (actor.type === ActivityActorType.AGENT) return actor.agentName ?? UNKNOWN_AGENT_NAME;
  return actor.name ?? DELETED_ACTOR_NAMES[actor.type];
}

/** The user an agent acted for. */
export function toAgentUserName(actor: ActivityActor): string {
  return actor.name ?? DELETED_ACTOR_NAMES[ActivityActorType.AGENT];
}
