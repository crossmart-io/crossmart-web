import { useMemo } from 'react';
import { useProductChannels } from './useProductChannels';

/** The names of the stores the product is in, for saying what marking it sold takes it off. */
export function useProductStoreNames(workspaceId: string, productId: string): string[] {
  const { data } = useProductChannels(workspaceId, productId);
  return useMemo(
    () =>
      (data ?? [])
        .filter((channel) => channel.selected)
        .map((channel) => channel.connection.displayName),
    [data],
  );
}
