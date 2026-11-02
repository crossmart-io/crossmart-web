import { ActivityActorType } from '@/api/schema';
import { APP_NAME } from '@/config/app';
import type { ActivityActor } from './activity.types';

/** Shown when the user or key that acted has since been deleted. */
const DELETED_ACTOR_NAMES: Record<ActivityActorType, string> = {
  [ActivityActorType.USER]: 'Deleted user',
  [ActivityActorType.API_KEY]: 'Deleted API key',
  [ActivityActorType.SYSTEM]: APP_NAME,
};

export function toActorName(actor: ActivityActor): string {
  if (actor.type === ActivityActorType.SYSTEM) return APP_NAME;
  return actor.name ?? DELETED_ACTOR_NAMES[actor.type];
}
