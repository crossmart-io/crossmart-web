import { PackageOpen } from 'lucide-react';
import type { ReactNode } from 'react';

interface ProductsEmptyStateProps {
  isFiltered: boolean;
  action: ReactNode;
}

export function ProductsEmptyState({ isFiltered, action }: ProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
      <PackageOpen className="size-8 text-muted-foreground" aria-hidden="true" />
      {isFiltered ? (
        <p className="text-muted-foreground">No products match these filters.</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Your catalog is empty</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Import a product export from Shopify to bring in your products, variants and stock.
            </p>
          </div>
          {action}
        </>
      )}
    </div>
  );
}
