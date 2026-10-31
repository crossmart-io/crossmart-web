import { api } from '@/api/client';
import { PathsApiV1HealthGetResponses200ContentApplicationJsonStatus as ApiHealthStatus } from '@/api/schema';
import { SystemStatus } from '../system-status.enum';

const HEALTH_ENDPOINT = '/api/v1/health';

interface HealthQueryState {
  isPending: boolean;
  isError: boolean;
  apiStatus?: ApiHealthStatus;
}

export function toSystemStatus({ isPending, isError, apiStatus }: HealthQueryState): SystemStatus {
  if (isPending) return SystemStatus.Checking;
  if (isError) return SystemStatus.Unavailable;
  if (apiStatus === ApiHealthStatus.ok) return SystemStatus.Operational;
  return SystemStatus.Degraded;
}

export function useSystemStatus(): SystemStatus {
  const { data, isPending, isError } = api.useQuery('get', HEALTH_ENDPOINT);
  return toSystemStatus({ isPending, isError, apiStatus: data?.status });
}
