import { Share2 } from 'lucide-react';
import { ChannelConnectionStatus, ProductStoreFilter } from '@/api/schema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { connectionName, useChannelConnections } from '@/features/channels';
import { ANY_STORE, STORE_FILTER_LABELS } from '../listings.constants';

export interface StoreFilterChoice {
  filter?: ProductStoreFilter;
  storeId?: string;
}

interface ProductStoreFilterSelectProps {
  workspaceId: string;
  value: StoreFilterChoice;
  onChange: (value: StoreFilterChoice) => void;
}

const VALUE_SEPARATOR = ':';

function toValue({ filter, storeId }: StoreFilterChoice): string {
  if (!filter) return ANY_STORE;
  return storeId ? `${filter}${VALUE_SEPARATOR}${storeId}` : filter;
}

function toChoice(value: string): StoreFilterChoice {
  if (value === ANY_STORE) return {};
  const [filter, storeId] = value.split(VALUE_SEPARATOR);
  const known = Object.values(ProductStoreFilter).find((candidate) => candidate === filter);
  return known ? { filter: known, storeId } : {};
}

/** Filters the products table by store: in one, not in one, in none, or with errors. */
export function ProductStoreFilterSelect({
  workspaceId,
  value,
  onChange,
}: ProductStoreFilterSelectProps) {
  const { data } = useChannelConnections(workspaceId);
  const stores = (data ?? []).filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  if (stores.length === 0) return null;
  return (
    <Select value={toValue(value)} onValueChange={(next) => onChange(toChoice(next))}>
      <SelectTrigger className="w-full sm:w-56" aria-label="Filter by store">
        <Share2 aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY_STORE}>All stores</SelectItem>
        <SelectItem value={ProductStoreFilter.in_no_store}>
          {STORE_FILTER_LABELS[ProductStoreFilter.in_no_store]}
        </SelectItem>
        <SelectItem value={ProductStoreFilter.with_errors}>
          {STORE_FILTER_LABELS[ProductStoreFilter.with_errors]}
        </SelectItem>
        {stores.map((store) => (
          <SelectGroup key={store.id}>
            <SelectSeparator />
            <SelectLabel>{connectionName(store)}</SelectLabel>
            <SelectItem value={toValue({ filter: ProductStoreFilter.in_store, storeId: store.id })}>
              In {connectionName(store)}
            </SelectItem>
            <SelectItem
              value={toValue({ filter: ProductStoreFilter.not_in_store, storeId: store.id })}
            >
              Not in {connectionName(store)}
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
