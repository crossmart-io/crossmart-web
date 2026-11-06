import { cn } from '@/lib/utils';
import type { CatalogImportMode } from '@/api/schema';
import { Card, CardContent } from '@/components/ui/card';
import { importCountsOf } from '../import-summary';
import type { ImportJobCounts as Counts } from '../imports.types';

/** Five tiles (channel imports) wrap three to a row before they fit on one line. */
const GRID_COLUMNS: Record<number, string> = {
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
};

interface ImportJobCountsProps {
  counts: Counts;
  mode: CatalogImportMode;
  /** Names what was counted, for screen readers. */
  record: string;
}

/** What an import did, one tile per outcome its mode reports. */
export function ImportJobCounts({ counts, mode, record }: ImportJobCountsProps) {
  const tiles = importCountsOf(counts, mode);
  return (
    <div className={cn('grid grid-cols-2 gap-3', GRID_COLUMNS[tiles.length])}>
      {tiles.map((tile) => (
        <Card key={tile.key} className="py-4">
          <CardContent className="flex flex-col gap-1 px-4">
            <span className="text-sm text-muted-foreground">{tile.label}</span>
            <span className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
              {tile.value.toLocaleString()}
            </span>
            <span className="sr-only">{record}s</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
