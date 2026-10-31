import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/config/env';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { SystemStatusBadge } from './SystemStatusBadge';

export function SystemStatusCard() {
  const status = useSystemStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>System status</CardTitle>
        <CardDescription>Crossmart API at {env.apiUrl}</CardDescription>
      </CardHeader>
      <CardContent>
        <SystemStatusBadge status={status} />
      </CardContent>
    </Card>
  );
}
