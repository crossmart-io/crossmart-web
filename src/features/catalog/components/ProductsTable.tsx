import { Link } from 'react-router';
import { cn } from 'cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toProductRoute } from '@/config/routes';
import { formatPriceRange } from '@/lib/format';
import type { ProductSummary } from '../catalog.types';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductThumbnail } from './ProductThumbnail';
import { StockLabel } from './StockLabel';

const NO_VALUE = '—';

interface ProductsTableProps {
  products: ProductSummary[];
  currency: string;
  /** A new filter is loading; the current rows stay, dimmed. */
  isRefreshing?: boolean;
}

export function ProductsTable({ products, currency, isRefreshing = false }: ProductsTableProps) {
  return (
    <div
      className={cn('rounded-lg border transition-opacity', isRefreshing && 'opacity-60')}
      aria-busy={isRefreshing}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Inventory</TableHead>
            <TableHead className="hidden text-right md:table-cell">Price</TableHead>
            <TableHead className="hidden lg:table-cell">Vendor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} currency={currency} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProductRow({ product, currency }: { product: ProductSummary; currency: string }) {
  const price = product.priceRange ? formatPriceRange(product.priceRange, currency) : NO_VALUE;

  return (
    <TableRow className="group/row">
      <TableCell className="max-w-0 md:max-w-none">
        <Link
          to={toProductRoute(product.id)}
          className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ProductThumbnail url={product.imageUrl} alt="" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium group-hover/row:underline">{product.title}</span>
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {product.handle}
            </span>
            {/* On narrow screens the status, price and stock columns fold into this cell. */}
            <span className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground md:hidden">
              <span className="sm:hidden">
                <ProductStatusBadge status={product.status} />
              </span>
              <span className="truncate">
                <span className="tabular-nums">{price}</span> ·{' '}
                <StockLabel
                  totalAvailable={product.totalAvailable}
                  variantCount={product.variantCount}
                />
              </span>
            </span>
          </span>
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <ProductStatusBadge status={product.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <StockLabel totalAvailable={product.totalAvailable} variantCount={product.variantCount} />
      </TableCell>
      <TableCell className="hidden text-right tabular-nums md:table-cell">{price}</TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {product.vendor ?? NO_VALUE}
      </TableCell>
    </TableRow>
  );
}
