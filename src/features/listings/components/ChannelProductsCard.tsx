import { Card, CardContent } from '@/components/ui/card';
import { useUpdateSelection } from '../hooks/useConnectionRules';
import { useChannelProductFilters } from '../hooks/useChannelProductFilters';
import { useChannelProducts } from '../hooks/useChannelProducts';
import { ALL_CHANNEL_PRODUCTS } from '../listings.constants';
import type { ProductSelectionRule } from '../listings.types';
import { toggleProductInRule } from '../selection-draft';
import { ChannelProductFilters } from './ChannelProductFilters';
import { ChannelProductsTable } from './ChannelProductsTable';
import { SelectionSummary } from './SelectionSummary';

interface ChannelProductsCardProps {
  workspaceId: string;
  connectionId: string;
  rule: ProductSelectionRule | null;
  canManage: boolean;
}

/**
 * One list for the store: which products it gets (the rule, in one line) and where each stands
 * on the channel, filtered by state, searched and sorted.
 */
export function ChannelProductsCard({
  workspaceId,
  connectionId,
  rule,
  canManage,
}: ChannelProductsCardProps) {
  const ref = { workspaceId, connectionId };
  const filters = useChannelProductFilters();
  const products = useChannelProducts(ref, {
    state: filters.filter === ALL_CHANNEL_PRODUCTS ? undefined : filters.filter,
    search: filters.search.debouncedValue || undefined,
    sort: filters.sort.sort,
    direction: filters.sort.direction,
  });
  const saveSelection = useUpdateSelection(ref);
  const toggle = (productId: string, include: boolean) =>
    saveSelection.mutate(toggleProductInRule(rule, productId, include));

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <SelectionSummary {...ref} rule={rule} canManage={canManage} />
        <ChannelProductFilters filters={filters} counts={products.counts} />
        <ChannelProductsTable
          products={products}
          onToggle={canManage ? toggle : undefined}
          isSaving={saveSelection.isPending}
        />
      </CardContent>
    </Card>
  );
}
