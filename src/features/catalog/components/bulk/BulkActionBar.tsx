import { Trash2, X } from 'lucide-react';
import { BulkProductAction } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Selection } from '@/hooks/useSelection';
import { pluralize } from '@/lib/format';
import { useBulkProductAction } from '../../hooks/useBulkProductAction';
import { BulkPricePopover } from './BulkPricePopover';
import { BulkStatusMenu } from './BulkStatusMenu';
import { BulkTagsPopover } from './BulkTagsPopover';

interface BulkActionBarProps {
  workspaceId: string;
  selection: Selection;
}

/** Floats over the list while products are selected, like the editor's save bar. */
export function BulkActionBar({ workspaceId, selection }: BulkActionBarProps) {
  const bulkAction = useBulkProductAction(workspaceId);
  const productIds = [...selection.ids];
  const busy = bulkAction.isPending;
  const count = pluralize(productIds.length, 'product');

  function run(body: Omit<Parameters<typeof bulkAction.mutateAsync>[0], 'productIds'>) {
    return bulkAction.mutateAsync({ ...body, productIds });
  }

  return (
    <section
      aria-label="Bulk actions"
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-2xl animate-in flex-wrap items-center gap-2 rounded-xl border bg-popover px-3 py-2 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:inset-x-6"
    >
      <span className="mr-auto flex items-center gap-2 pl-1 text-sm font-medium" aria-live="polite">
        {busy && <Spinner />}
        {count} selected
      </span>
      <BulkStatusMenu
        disabled={busy}
        onSelect={(status) => void run({ action: BulkProductAction.set_status, status })}
      />
      <BulkTagsPopover
        disabled={busy}
        onAdd={(tags) => void run({ action: BulkProductAction.add_tags, tags })}
        onRemove={(tags) => void run({ action: BulkProductAction.remove_tags, tags })}
      />
      <BulkPricePopover
        disabled={busy}
        onApply={(percent) => void run({ action: BulkProductAction.adjust_prices, percent })}
      />
      <ConfirmDialog
        trigger={
          <Button variant="destructive" size="sm" disabled={busy}>
            <Trash2 data-icon="inline-start" />
            Delete
          </Button>
        }
        title={`Delete ${count}?`}
        description="Their variants, images and stock history are deleted too. This cannot be undone."
        confirmLabel={`Delete ${count}`}
        onConfirm={async () => {
          await run({ action: BulkProductAction.delete });
          selection.clear();
        }}
      />
      <Button variant="ghost" size="icon-sm" onClick={selection.clear} aria-label="Clear selection">
        <X />
      </Button>
    </section>
  );
}
