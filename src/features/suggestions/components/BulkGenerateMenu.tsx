import { ChevronDown, PenLine } from 'lucide-react';
import { ChannelConnectionStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { connectionName, useChannelConnections } from '@/features/channels';
import { useGenerateContent } from '../hooks/useGenerateContent';
import { GenerateAvailability, useGenerateAvailability } from '../hooks/useGenerateAvailability';
import { AI_COPY } from '../suggestions.constants';

interface BulkGenerateMenuProps {
  workspaceId: string;
  productIds: readonly string[];
  disabled?: boolean;
}

/** The products table's bulk action: ask AI to write the selected products for one store. */
export function BulkGenerateMenu({ workspaceId, productIds, disabled }: BulkGenerateMenuProps) {
  const availability = useGenerateAvailability();
  const { data } = useChannelConnections(workspaceId);
  const generate = useGenerateContent(workspaceId);
  const stores = (data ?? []).filter(
    (connection) => connection.status === ChannelConnectionStatus.CONNECTED,
  );
  if (availability === GenerateAvailability.Hidden || stores.length === 0) return null;
  const notConfigured = availability === GenerateAvailability.NotConfigured;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || notConfigured || generate.isPending}
          title={notConfigured ? AI_COPY.notConfiguredTitle : undefined}
        >
          <PenLine data-icon="inline-start" />
          {AI_COPY.generate}
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>Write for</DropdownMenuLabel>
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onSelect={() => generate.mutate({ connectionId: store.id, productIds })}
          >
            {connectionName(store)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
