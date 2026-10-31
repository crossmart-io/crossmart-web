import { Badge } from '@/components/ui/badge';
import { SystemStatus } from '../system-status.enum';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const STATUS_PRESENTATION: Record<SystemStatus, { label: string; variant: BadgeVariant }> = {
  [SystemStatus.Checking]: { label: 'Checking…', variant: 'outline' },
  [SystemStatus.Operational]: { label: 'Operational', variant: 'default' },
  [SystemStatus.Degraded]: { label: 'Degraded', variant: 'secondary' },
  [SystemStatus.Unavailable]: { label: 'Unavailable', variant: 'destructive' },
};

interface SystemStatusBadgeProps {
  status: SystemStatus;
}

export function SystemStatusBadge({ status }: SystemStatusBadgeProps) {
  const { label, variant } = STATUS_PRESENTATION[status];
  return <Badge variant={variant}>{label}</Badge>;
}
