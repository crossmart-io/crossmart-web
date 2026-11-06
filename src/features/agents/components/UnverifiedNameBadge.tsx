import { ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AGENT_IDENTITY_COPY } from '../agents.constants';

/** Marks a name a self-registered agent chose itself, which Crossmart could not check. */
export function UnverifiedNameBadge() {
  return (
    <Badge variant="warning">
      <ShieldAlert data-icon="inline-start" aria-hidden="true" />
      {AGENT_IDENTITY_COPY.unverifiedName}
    </Badge>
  );
}
