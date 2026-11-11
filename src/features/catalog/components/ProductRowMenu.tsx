import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProductSummary } from '../catalog.types';
import { MarkSoldMenuItem } from '../sold/MarkSoldMenuItem';
import { soldStateOfSummary } from '../sold/sold-state';

interface ProductRowMenuProps {
  workspaceId: string;
  product: ProductSummary;
}

/** A row's own actions, for members who may edit products. */
export function ProductRowMenu({ workspaceId, product }: ProductRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${product.title}`}
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <MarkSoldMenuItem
          workspaceId={workspaceId}
          productId={product.id}
          title={product.title}
          {...soldStateOfSummary(product)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
