import type { PublishFailure, PublishResult } from './publish-on-create';

/** What the product's page is told about publishing it, through the navigation state. */
export interface PublishResultState {
  publishResult: { added: number; failures: PublishFailure[] };
}

export function toPublishResultState(result: PublishResult): PublishResultState {
  return { publishResult: { added: result.added.length, failures: result.failures } };
}

function isFailure(value: unknown): value is PublishFailure {
  if (typeof value !== 'object' || value === null) return false;
  const { storeName, message } = value as Record<string, unknown>;
  return typeof storeName === 'string' && typeof message === 'string';
}

/** The publish result a page was opened with, or null; history state is not to be trusted. */
export function publishResultFromState(state: unknown): PublishResultState['publishResult'] | null {
  if (typeof state !== 'object' || state === null || !('publishResult' in state)) return null;
  const result = (state as Partial<PublishResultState>).publishResult;
  if (typeof result?.added !== 'number' || !Array.isArray(result.failures)) return null;
  return result.failures.every(isFailure) ? result : null;
}
