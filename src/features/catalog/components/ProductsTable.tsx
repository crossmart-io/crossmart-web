import { Link } from 'react-router';
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

interface ProductsTableProps {
  products: ProductSummary[];
  currency: string;
}

export function ProductsTable({ products, currency }: ProductsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="hidden md:table-cell">Vendor</TableHead>
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
  return (
    <TableRow>
      <TableCell>
        <Link to={toProductRoute(product.id)} className="flex items-center gap-3 hover:underline">
          <ProductThumbnail url={product.imageUrl} alt="" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{product.title}</span>
            <span className="truncate text-xs text-muted-foreground">{product.handle}</span>
          </span>
        </Link>
      </TableCell>
      <TableCell>
        <ProductStatusBadge status={product.status} />
      </TableCell>
      <TableCell>
        <StockLabel totalAvailable={product.totalAvailable} variantCount={product.variantCount} />
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {product.priceRange ? formatPriceRange(product.priceRange, currency) : '—'}
      </TableCell>
      <TableCell className="hidden text-muted-foreground md:table-cell">
        {product.vendor ?? '—'}
      </TableCell>
    </TableRow>
  );
}
