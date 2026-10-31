import { PathsApiV1HealthGetResponses200ContentApplicationJsonStatus as ApiHealthStatus } from '@/api/schema';
import { SystemStatus } from '../system-status.enum';
import { toSystemStatus } from './useSystemStatus';

describe('toSystemStatus', () => {
  it('is checking while the request is pending', () => {
    expect(toSystemStatus({ isPending: true, isError: false })).toBe(SystemStatus.Checking);
  });

  it('is unavailable when the API cannot be reached', () => {
    expect(toSystemStatus({ isPending: false, isError: true })).toBe(SystemStatus.Unavailable);
  });

  it('is operational when the API reports ok', () => {
    expect(
      toSystemStatus({ isPending: false, isError: false, apiStatus: ApiHealthStatus.ok }),
    ).toBe(SystemStatus.Operational);
  });

  it('is degraded for any other API status', () => {
    expect(
      toSystemStatus({ isPending: false, isError: false, apiStatus: ApiHealthStatus.degraded }),
    ).toBe(SystemStatus.Degraded);
  });
});
