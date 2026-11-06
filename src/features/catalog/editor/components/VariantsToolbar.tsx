import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import type { VariantGroupsState } from '../useVariantGroups';
import { VARIANTS_COPY } from '../variants.constants';
import { BulkVariantEditor } from './BulkVariantEditor';

function VariantFilter({ query, onChange }: { query: string; onChange: (query: string) => void }) {
  return (
    <InputGroup className="sm:max-w-72">
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        // Enter would submit the product form.
        onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        placeholder={VARIANTS_COPY.filterPlaceholder}
        aria-label={VARIANTS_COPY.filterLabel}
        autoComplete="off"
      />
    </InputGroup>
  );
}

interface VariantsToolbarProps {
  layout: VariantGroupsState;
  currency: string;
}

/** Above the grid: the filter, opening and closing every group, and a bulk edit of what is shown. */
export function VariantsToolbar({ layout, currency }: VariantsToolbarProps) {
  const filtered = layout.query.trim() !== '';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {layout.filterable && <VariantFilter query={layout.query} onChange={layout.setQuery} />}
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {layout.grouped && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={layout.allExpanded ? layout.collapseAll : layout.expandAll}
            disabled={layout.groups.length === 0}
          >
            {layout.allExpanded ? VARIANTS_COPY.collapseAll : VARIANTS_COPY.expandAll}
          </Button>
        )}
        <BulkVariantEditor
          indices={layout.visibleIndices}
          currency={currency}
          label={filtered ? VARIANTS_COPY.setForShown : VARIANTS_COPY.setForAll}
        />
      </div>
    </div>
  );
}
