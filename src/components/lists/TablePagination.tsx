import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Pagination } from '@/hooks/usePagination';
import { pluralize } from '@/lib/format';
import { PAGE_GAP, PAGE_SIZE_OPTIONS, pageLinksOf, rowRangeOf, toPageSize } from './pagination';

interface TablePaginationProps {
  pagination: Pagination;
  total: number;
  pageCount: number;
  /** What the rows are, as "312 products" says it. */
  noun: string;
  /** The plural, when adding an s does not make it ("deliveries"). */
  pluralNoun?: string;
  /** A new page is loading while the current rows stay. */
  isFetching?: boolean;
}

function PageLinks({
  pagination,
  pageCount,
}: Pick<TablePaginationProps, 'pagination' | 'pageCount'>) {
  const { page, setPage } = pagination;
  return (
    <>
      <span className="text-sm text-muted-foreground tabular-nums sm:hidden">
        {page} / {pageCount}
      </span>
      <ul className="hidden items-center gap-1 sm:flex">
        {pageLinksOf(page, pageCount).map((link, index) =>
          link === PAGE_GAP ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={link}>
              <Button
                type="button"
                variant={link === page ? 'outline' : 'ghost'}
                size="icon"
                className="tabular-nums"
                aria-label={`Page ${link}`}
                aria-current={link === page ? 'page' : undefined}
                onClick={() => setPage(link)}
              >
                {link}
              </Button>
            </li>
          ),
        )}
      </ul>
    </>
  );
}

function PageSizeSelect({ pagination }: Pick<TablePaginationProps, 'pagination'>) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">Rows per page</span>
      <Select
        value={String(pagination.pageSize)}
        onValueChange={(value) => pagination.setPageSize(toPageSize(value))}
      >
        <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** A table's footer: which rows are shown of how many, rows per page, and the page links. */
export function TablePagination({
  pagination,
  total,
  pageCount,
  noun,
  pluralNoun,
  isFetching = false,
}: TablePaginationProps) {
  const { page, pageSize, setPage } = pagination;
  const { first, last } = rowRangeOf(page, pageSize, total);
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      <p
        className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        {total > 0
          ? `${first}–${last} of ${pluralize(total, noun, pluralNoun)}`
          : pluralize(0, noun, pluralNoun)}
        {isFetching && <Spinner aria-label="Loading" />}
      </p>
      <div className="flex items-center gap-4">
        <PageSizeSelect pagination={pagination} />
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <PageLinks pagination={pagination} pageCount={pageCount} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </nav>
  );
}
