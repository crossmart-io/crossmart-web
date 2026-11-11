import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { ProductStoreFilter } from '@/api/schema';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES, toProductsRoute } from '@/config/routes';
import { attentionRows, hiddenFailedListings, hiddenStores } from '../attention-rows';
import { ATTENTION_COPY } from '../attention.constants';
import type { AttentionSummary } from '../attention.types';
import { useAttention } from '../hooks/useAttention';
import { AttentionRowItem } from './AttentionRowItem';

const HEADING_ID = 'needs-attention-heading';

function AllGood() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <CircleCheck className="size-4 text-success" aria-hidden="true" />
      {ATTENTION_COPY.allGood}
    </p>
  );
}

/** Links to the full lists when Home shows only the latest few. */
function MoreLinks({ summary }: { summary: AttentionSummary }) {
  const stores = hiddenStores(summary);
  const listings = hiddenFailedListings(summary);
  if (stores === 0 && listings === 0) return null;
  const linkClass = 'font-medium text-foreground underline-offset-4 hover:underline';
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-sm">
      {stores > 0 && (
        <Link to={ROUTES.stores} className={linkClass}>
          {ATTENTION_COPY.moreStores(stores)}
        </Link>
      )}
      {listings > 0 && (
        <Link
          to={toProductsRoute({ storeFilter: ProductStoreFilter.with_errors })}
          className={linkClass}
        >
          {ATTENTION_COPY.moreListings(summary.listings?.count ?? 0)}
        </Link>
      )}
    </div>
  );
}

/**
 * Home's first section: every store to reconnect, listing to fix and change to review, each
 * with a link to where it is done. One quiet line when there is nothing.
 */
export function NeedsAttention({ workspaceId }: { workspaceId: string }) {
  const { data: summary } = useAttention(workspaceId);
  if (!summary) return null;
  if (summary.total === 0) return <AllGood />;
  return (
    <section aria-labelledby={HEADING_ID}>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>
            <h2 id={HEADING_ID}>{ATTENTION_COPY.title}</h2>
          </CardTitle>
          <CardAction>
            <span className="rounded-full bg-warning/15 px-2 text-xs leading-5 font-semibold text-warning tabular-nums">
              {summary.total.toLocaleString()}
            </span>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <ul className="flex flex-col divide-y">
            {attentionRows(summary).map((row) => (
              <AttentionRowItem key={row.key} row={row} />
            ))}
          </ul>
          <MoreLinks summary={summary} />
        </CardContent>
      </Card>
    </section>
  );
}
