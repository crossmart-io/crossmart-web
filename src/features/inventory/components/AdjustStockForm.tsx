import { ArrowRight } from 'lucide-react';
import { type FormEvent, type ReactNode, useId } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { StockAdjustmentMode } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAdjustStock } from '../hooks/useAdjustStock';
import { useAdjustStockForm } from '../hooks/useAdjustStockForm';
import { MOVEMENT_NOTE_MAX_LENGTH } from '../inventory.constants';
import type { InventoryItem } from '../inventory.types';
import { nextOnHand } from '../stock-adjustment';
import { MovementReasonSelect } from './MovementReasonSelect';
import { QuantityStepper } from './QuantityStepper';

const MODE_OPTIONS = [
  { value: StockAdjustmentMode.delta, label: 'Add or remove', quantityLabel: 'Units' },
  { value: StockAdjustmentMode.set, label: 'Set to', quantityLabel: 'Counted on hand' },
] as const;

interface AdjustStockFormProps {
  workspaceId: string;
  item: InventoryItem;
  onDone: () => void;
}

/** Adds, removes or sets the stock on hand of one variant, with a reason for the history. */
export function AdjustStockForm({ workspaceId, item, onDone }: AdjustStockFormProps) {
  const ids = { quantity: useId(), reason: useId(), note: useId(), preview: useId() };
  const form = useAdjustStockForm(item);
  const adjust = useAdjustStock(workspaceId);
  const modeOption = MODE_OPTIONS.find((option) => option.value === form.mode) ?? MODE_OPTIONS[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.body) return;
    adjust
      .mutateAsync({ inventoryItemId: item.inventoryItemId, body: form.body })
      .then(onDone)
      .catch(() => undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <ModeToggle mode={form.mode} onChange={form.changeMode} />
      <FormRow id={ids.quantity} label={modeOption.quantityLabel}>
        <QuantityStepper
          id={ids.quantity}
          value={form.quantityText}
          onChange={form.setQuantityText}
          min={form.mode === StockAdjustmentMode.set ? 0 : -item.onHand}
          describedBy={ids.preview}
          invalid={form.isQuantityInvalid}
        />
      </FormRow>
      <FormRow id={ids.reason} label="Reason">
        <MovementReasonSelect id={ids.reason} value={form.reason} onChange={form.setReason} />
      </FormRow>
      <FormRow id={ids.note} label="Note" optional>
        <Input
          id={ids.note}
          value={form.note}
          onChange={(event) => form.setNote(event.target.value)}
          maxLength={MOVEMENT_NOTE_MAX_LENGTH}
          placeholder="PO number, who counted…"
        />
      </FormRow>
      <StockPreview id={ids.preview} item={item} mode={form.mode} quantity={form.quantity} />
      <FormError error={adjust.error} />
      <Button type="submit" disabled={!form.body || adjust.isPending}>
        {adjust.isPending && <Spinner data-icon="inline-start" />}
        Save
      </Button>
    </form>
  );
}

function isMode(value: string): value is StockAdjustmentMode {
  return MODE_OPTIONS.some((option) => option.value === value);
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: StockAdjustmentMode;
  onChange: (mode: StockAdjustmentMode) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={mode}
      onValueChange={(value) => isMode(value) && onChange(value)}
      aria-label="How to change the stock"
      className="w-full"
    >
      {MODE_OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} className="flex-1">
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

interface FormRowProps {
  id: string;
  label: string;
  optional?: boolean;
  children: ReactNode;
}

function FormRow({ id, label, optional = false, children }: FormRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
    </div>
  );
}

interface StockPreviewProps {
  id: string;
  item: InventoryItem;
  mode: StockAdjustmentMode;
  quantity: number | null;
}

/** What the stock on hand becomes, before the change is saved. */
function StockPreview({ id, item, mode, quantity }: StockPreviewProps) {
  const next = quantity === null ? null : nextOnHand(item.onHand, mode, quantity);
  return (
    <p id={id} className="flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
      On hand <span className="font-medium text-foreground">{item.onHand.toLocaleString()}</span>
      {next !== null && next !== item.onHand && (
        <>
          <ArrowRight className="size-3.5" aria-label="becomes" />
          <span className="font-medium text-foreground">{next.toLocaleString()}</span>
        </>
      )}
      {item.reserved > 0 && <span>· {item.reserved.toLocaleString()} reserved</span>}
    </p>
  );
}
