import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import type { AttentionRow } from '../attention.types';
import { AttentionRowPicture } from './AttentionRowPicture';

/** One thing to act on: what it is, what is wrong, and a link to where it is fixed. */
export function AttentionRowItem({ row }: { row: AttentionRow }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <AttentionRowPicture row={row} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{row.title}</span>
        <span className="line-clamp-2 text-xs break-words text-muted-foreground" title={row.detail}>
          {row.detail}
        </span>
      </div>
      <Button asChild variant="outline" size="xs" className="shrink-0">
        <Link to={row.to}>
          {row.action}
          <span className="sr-only">: {row.title}</span>
        </Link>
      </Button>
    </li>
  );
}
