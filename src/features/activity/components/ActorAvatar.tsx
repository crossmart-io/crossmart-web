import { KeyRound } from 'lucide-react';
import { ActivityActorType } from '@/api/schema';
import { BrandMark } from '@/components/brand/BrandMark';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toInitials } from '@/features/auth';
import { cn } from 'cn';
import type { ActivityActor } from '../activity.types';
import { toActorName } from '../activity-actor';

interface ActorAvatarProps {
  actor: ActivityActor;
  className?: string;
}

/** Initials for people, a key for API keys, the Crossmart mark for system work. */
export function ActorAvatar({ actor, className }: ActorAvatarProps) {
  return (
    <Avatar className={cn('size-8', className)} aria-hidden="true">
      <AvatarFallback className="text-xs">
        <ActorGlyph actor={actor} />
      </AvatarFallback>
    </Avatar>
  );
}

function ActorGlyph({ actor }: { actor: ActivityActor }) {
  switch (actor.type) {
    case ActivityActorType.USER:
      return toInitials(toActorName(actor)) || '?';
    case ActivityActorType.API_KEY:
      return <KeyRound className="size-4" />;
    case ActivityActorType.SYSTEM:
      return <BrandMark className="size-4" />;
  }
}
