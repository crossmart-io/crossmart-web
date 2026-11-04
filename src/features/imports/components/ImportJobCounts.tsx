import { Card, CardContent } from '@/components/ui/card';
import type { ImportJobCounts as Counts } from '../imports.types';

const COUNT_TILES = [
  { key: 'created', label: 'Created' },
  { key: 'updated', label: 'Updated' },
  { key: 'skipped', label: 'Skipped' },
  { key: 'failed', label: 'Failed' },
] as const satisfies readonly { key: keyof Counts; label: string }[];

/** What an import did, one tile per outcome. `record` names what was counted. */
export function ImportJobCounts({ counts, record }: { counts: Counts; record: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {COUNT_TILES.map((tile) => (
        <Card key={tile.key} className="py-4">
          <CardContent className="flex flex-col gap-1 px-4">
            <span className="text-sm text-muted-foreground">{tile.label}</span>
            <span className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
              {counts[tile.key].toLocaleString()}
            </span>
            <span className="sr-only">{record}s</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
