import { useState } from 'react';
import type { CatalogImportFormat, ImportJobStatus } from '@/api/schema';
import {
  type ByTime,
  type SortOption,
  TIME_SORTS,
  toSortOption,
} from '@/components/lists/sort-options';

export interface ImportJobFilters {
  status: ImportJobStatus | undefined;
  setStatus: (status: ImportJobStatus | undefined) => void;
  format: CatalogImportFormat | undefined;
  setFormat: (format: CatalogImportFormat | undefined) => void;
  sort: SortOption<ByTime>;
  setSort: (value: string) => void;
  isFiltered: boolean;
  clearAll: () => void;
  /** Changes whenever a filter does, so the pages start over. */
  key: string;
}

/** The import history's filters: status, where the records came from, and order. */
export function useImportJobFilters(): ImportJobFilters {
  const [status, setStatus] = useState<ImportJobStatus>();
  const [format, setFormat] = useState<CatalogImportFormat>();
  const [sortValue, setSort] = useState<string>(TIME_SORTS[0].value);
  const sort = toSortOption(TIME_SORTS, sortValue);
  return {
    status,
    setStatus,
    format,
    setFormat,
    sort,
    setSort,
    isFiltered: Boolean(status ?? format),
    clearAll: () => {
      setStatus(undefined);
      setFormat(undefined);
    },
    key: [status, format, sort.value].join('|'),
  };
}
