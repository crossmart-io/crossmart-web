/** UI-level status, derived from the API health check. */
export enum SystemStatus {
  Checking = 'checking',
  Operational = 'operational',
  Degraded = 'degraded',
  Unavailable = 'unavailable',
}
