import { ChevronDown, Share2 } from 'lucide-react';
import { ChannelConnectionStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { connectionName, useChannelConnections } from '@/features/channels';
import { useAddStoreProducts, useRemoveStoreProducts } from '../hooks/useStoreProducts';

interface StoreMembershipMenuProps {
  workspaceId: string;
  productIds: readonly string[];
  disabled?: boolean;
}

/** The products table's bulk action: add the selected products to a store, or remove them. */
export function StoreMembershipMenu({
  workspaceId,
  productIds,
  disabled,
}: StoreMembershipMenuProps) {
  const { data } = useChannelConnections(workspaceId);
  const stores = (data ?? []).filter(
    (connection) => connection.status === ChannelConnectionStatus.CONNECTED,
  );
  const add = useAddStoreProducts();
  const remove = useRemoveStoreProducts();
  if (stores.length === 0) return null;
  const busy = disabled || add.isPending || remove.isPending;
  const change = (mutation: typeof add, connectionId: string) =>
    void mutation.mutateAsync({ ref: { workspaceId, connectionId }, productIds });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={busy}>
          <Share2 data-icon="inline-start" />
          Stores
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>Add to</DropdownMenuLabel>
        {stores.map((store) => (
          <DropdownMenuItem key={`add-${store.id}`} onSelect={() => change(add, store.id)}>
            {connectionName(store)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Remove from</DropdownMenuLabel>
        {stores.map((store) => (
          <DropdownMenuItem key={`remove-${store.id}`} onSelect={() => change(remove, store.id)}>
            {connectionName(store)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
