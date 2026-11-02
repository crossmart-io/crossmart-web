import { ChevronDown } from 'lucide-react';
import { ProductStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PRODUCT_STATUS_LABELS } from '../../product-status';

interface BulkStatusMenuProps {
  disabled: boolean;
  onSelect: (status: ProductStatus) => void;
}

export function BulkStatusMenu({ disabled, onSelect }: BulkStatusMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Status
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {Object.values(ProductStatus).map((status) => (
            <DropdownMenuItem key={status} onSelect={() => onSelect(status)}>
              Set to {PRODUCT_STATUS_LABELS[status].toLowerCase()}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
