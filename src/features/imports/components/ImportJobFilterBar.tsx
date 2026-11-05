import { FilterSelect } from '@/components/lists/FilterSelect';
import { toEnumOptions } from '@/lib/enum';
import { SortSelect } from '@/components/lists/SortSelect';
import { TIME_SORTS } from '@/components/lists/sort-options';
import type { CatalogImportFormat, ImportJobStatus } from '@/api/schema';
import type { ImportJobFilters } from '../hooks/useImportJobFilters';
import { IMPORT_FORMAT_LABELS, IMPORT_JOB_STATUS_LABELS } from '../imports.constants';

const STATUS_OPTIONS = toEnumOptions<ImportJobStatus>(IMPORT_JOB_STATUS_LABELS);
const FORMAT_OPTIONS = toEnumOptions<CatalogImportFormat>(IMPORT_FORMAT_LABELS);

/** Narrows the import history by status and source, and orders it by time. */
export function ImportJobFilterBar({ filters }: { filters: ImportJobFilters }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterSelect
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={filters.setStatus}
          anyLabel="All statuses"
          label="Filter by status"
        />
        <FilterSelect
          options={FORMAT_OPTIONS}
          value={filters.format}
          onChange={filters.setFormat}
          anyLabel="All sources"
          label="Filter by source"
        />
      </div>
      <SortSelect options={TIME_SORTS} value={filters.sort.value} onChange={filters.setSort} />
    </div>
  );
}
