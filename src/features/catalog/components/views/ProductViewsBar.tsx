import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { matchesFilters, type ProductListFilters } from '../../hooks/useProductListFilters';
import { useDeleteProductView, useProductViews } from '../../hooks/useProductViews';
import { SaveViewDialog } from './SaveViewDialog';

interface ProductViewsBarProps {
  workspaceId: string;
  filters: ProductListFilters;
}

/** "All products", then the workspace's saved views; the one on screen is highlighted. */
export function ProductViewsBar({ workspaceId, filters }: ProductViewsBarProps) {
  const { data: views = [] } = useProductViews(workspaceId);
  const deleteView = useDeleteProductView(workspaceId);
  const activeView = views.find((view) => matchesFilters(filters, view));
  const canSave = filters.isFiltered && !activeView;

  return (
    <nav
      aria-label="Saved views"
      className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1"
    >
      <ViewChip label="All products" isActive={!filters.isFiltered} onOpen={filters.clearAll} />
      {views.map((view) => (
        <ViewChip
          key={view.id}
          label={view.name}
          isActive={view.id === activeView?.id}
          onOpen={() => filters.applyFilters(view)}
          onDelete={() => deleteView.mutate(view.id)}
        />
      ))}
      {canSave && <SaveViewDialog workspaceId={workspaceId} filters={filters} />}
    </nav>
  );
}

interface ViewChipProps {
  label: string;
  isActive: boolean;
  onOpen: () => void;
  onDelete?: () => void;
}

function ViewChip({ label, isActive, onOpen, onDelete }: ViewChipProps) {
  return (
    <span
      className={cn(
        'group/chip inline-flex shrink-0 items-center rounded-md text-sm transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-current={isActive ? 'page' : undefined}
        className="rounded-md px-2.5 py-1 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {label}
      </button>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="mr-0.5 opacity-0 group-focus-within/chip:opacity-100 group-hover/chip:opacity-100 pointer-coarse:opacity-100"
          onClick={onDelete}
          aria-label={`Delete view ${label}`}
        >
          <X />
        </Button>
      )}
    </span>
  );
}
