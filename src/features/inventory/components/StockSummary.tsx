import type { InventoryItem } from '../inventory.types';

const COLUMNS = [
  { key: 'onHand', label: 'On hand' },
  { key: 'reserved', label: 'Reserved' },
  { key: 'available', label: 'Available' },
] as const satisfies readonly { key: keyof InventoryItem; label: string }[];

/** On hand, reserved and available side by side. */
export function StockSummary({ item }: { item: InventoryItem }) {
  return (
    <dl className="grid grid-cols-3 divide-x rounded-lg border">
      {COLUMNS.map((column) => (
        <div key={column.key} className="flex flex-col gap-0.5 px-3 py-2">
          <dt className="text-xs text-muted-foreground">{column.label}</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {item[column.key].toLocaleString()}
          </dd>
        </div>
      ))}
    </dl>
  );
}
