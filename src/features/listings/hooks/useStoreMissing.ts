import type { PublishRequirement } from '@/api/schema';
import { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';

export type StoreMissingByConnection = ReadonlyMap<string, readonly PublishRequirement[]>;

/** What each store's setup still lacks, by store, so a listing's fix can point there. */
export function useStoreMissing(workspaceId: string): StoreMissingByConnection | undefined {
  const { data } = useChannelConnections(workspaceId);
  if (!data) return undefined;
  return new Map(data.map((connection) => [connection.id, connection.publishReadiness.missing]));
}
