import { CatalogGap } from '@/api/schema';
import { TagInput } from '@/components/forms/TagInput';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ALL_STATUSES, CATALOG_GAP_COPY, ProductFilters, toStatusQuery } from '@/features/catalog';
import { parseEnum } from '@/lib/enum';
import type { SelectionDraft } from '../selection-draft';

const ANY_GAP = 'any';

interface SelectionFiltersProps {
  draft: SelectionDraft;
  onChange: (draft: SelectionDraft) => void;
  disabled: boolean;
}

/** The catalog list filters, as a connection's selection stores them. */
export function SelectionFilters({ draft, onChange, disabled }: SelectionFiltersProps) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-4">
      <ProductFilters
        search={draft.search}
        onSearchChange={(search) => onChange({ ...draft, search })}
        status={draft.status ?? ALL_STATUSES}
        onStatusChange={(status) => onChange({ ...draft, status: toStatusQuery(status) })}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="selection-tags">Tags</FieldLabel>
          <TagInput
            id="selection-tags"
            value={draft.tags}
            onChange={(tags) => onChange({ ...draft, tags })}
            placeholder="Any of these tags"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="selection-vendor">Vendor</FieldLabel>
          <Input
            id="selection-vendor"
            value={draft.vendor}
            onChange={(event) => onChange({ ...draft, vendor: event.target.value })}
            placeholder="Any vendor"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="selection-gap">Missing</FieldLabel>
          <Select
            value={draft.gap ?? ANY_GAP}
            onValueChange={(value) => onChange({ ...draft, gap: parseEnum(CatalogGap, value) })}
          >
            <SelectTrigger id="selection-gap" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_GAP}>Nothing in particular</SelectItem>
              {Object.values(CatalogGap).map((gap) => (
                <SelectItem key={gap} value={gap}>
                  {CATALOG_GAP_COPY[gap].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </fieldset>
  );
}
