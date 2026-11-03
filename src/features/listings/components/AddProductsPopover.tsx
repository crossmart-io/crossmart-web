import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProductThumbnail, SEARCH_DEBOUNCE_MS, useProducts } from '@/features/catalog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface AddProductsPopoverProps {
  workspaceId: string;
  /** Products already in the selection, shown as added. */
  selectedIds: ReadonlySet<string>;
  onAdd: (productId: string) => void;
}

const RESULT_LIMIT = 8;

/** Finds catalog products by title, handle or SKU and adds them to the selection by hand. */
export function AddProductsPopover({ workspaceId, selectedIds, onAdd }: AddProductsPopoverProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { products, isPending } = useProducts({
    workspaceId,
    search: debouncedSearch,
    status: undefined,
    gap: undefined,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus data-icon="inline-start" />
          Add products
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-80 flex-col gap-2">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, handle or SKU"
          aria-label="Search products to add"
        />
        {isPending ? (
          <p className="px-1 text-sm text-muted-foreground">Searching…</p>
        ) : (
          <ul className="flex max-h-72 flex-col overflow-y-auto">
            {products.slice(0, RESULT_LIMIT).map((product) => (
              <li key={product.id} className="flex items-center gap-2 py-1.5">
                <ProductThumbnail url={product.imageUrl} alt="" className="size-8" />
                <span className="min-w-0 flex-1 truncate text-sm">{product.title}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={selectedIds.has(product.id)}
                  onClick={() => onAdd(product.id)}
                >
                  {selectedIds.has(product.id) ? 'Added' : 'Add'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
