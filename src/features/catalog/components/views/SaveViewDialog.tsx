import { BookmarkPlus } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toStatusQuery } from '../../product-status';
import { useCreateProductView } from '../../hooks/useProductViews';
import type { ProductListFilters } from '../../hooks/useProductListFilters';

const VIEW_NAME_MAX_LENGTH = 60;

interface SaveViewDialogProps {
  workspaceId: string;
  filters: ProductListFilters;
}

/** Names the current search, status and gap so the whole team can open them in one click. */
export function SaveViewDialog({ workspaceId, filters }: SaveViewDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const createView = useCreateProductView(workspaceId);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setName('');
      createView.reset();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createView.mutateAsync({
      name: name.trim(),
      search: filters.debouncedSearch || undefined,
      status: toStatusQuery(filters.status),
      gap: filters.gap,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <BookmarkPlus data-icon="inline-start" />
          Save view
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(event).catch(() => undefined)}
          className="contents"
        >
          <DialogHeader>
            <DialogTitle>Save this view</DialogTitle>
            <DialogDescription>
              Everyone in the workspace sees it above the product list.
            </DialogDescription>
          </DialogHeader>
          <FormError error={createView.error} />
          <ViewNameField value={name} onChange={setName} />
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || createView.isPending}>
              {createView.isPending && <Spinner data-icon="inline-start" />}
              Save view
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ViewNameField({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const inputId = useId();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>Name</Label>
      <Input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={VIEW_NAME_MAX_LENGTH}
        placeholder="Out of stock in Kitchen"
      />
    </div>
  );
}
