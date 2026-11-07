import { useState } from 'react';
import { ROUTE_QUERY } from '@/config/routes';
import { useEditorSearchParam } from '@/features/listings/hooks/useEditorSearchParam';
import { useProductChannels } from '@/features/listings/hooks/useProductChannels';
import { useProductSuggestions } from '@/features/suggestions';

/**
 * The product's stores and their pending AI suggestions, the store whose panel is open, and the
 * way to its listing editor. The editor is the product page's own: the channels card opens it
 * from the URL (`?override=<store>`), so the map only names the store there.
 */
export function useProductChannelMap(workspaceId: string, productId: string) {
  const channels = useProductChannels(workspaceId, productId);
  const suggestions = useProductSuggestions(workspaceId, productId);
  const editor = useEditorSearchParam(ROUTE_QUERY.overrideStore);
  const [openId, setOpenId] = useState<string | null>(null);
  const suggestionCounts = new Map(
    [...suggestions.byStore].flatMap(([storeId, items]) =>
      storeId ? [[storeId, items.length] as const] : [],
    ),
  );
  return {
    channels,
    suggestionsByStore: suggestions.byStore,
    suggestionCounts,
    openChannel: channels.data?.find(({ connection }) => connection.id === openId),
    open: setOpenId,
    close: () => setOpenId(null),
    editOverrides: (connectionId: string) => {
      setOpenId(null);
      editor.open(connectionId);
    },
  };
}
