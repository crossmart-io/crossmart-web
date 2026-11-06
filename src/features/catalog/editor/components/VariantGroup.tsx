import { ChevronRight } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatPriceRange, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ProductFormValues } from '../product-form.schema';
import type { VariantGroupSummary } from '../variant-groups';
import { VARIANTS_COPY } from '../variants.constants';
import { BulkVariantEditor } from './BulkVariantEditor';

const SUMMARY_SEPARATOR = ' · ';
const SPOKEN_SEPARATOR = ', ';

/** How many of the group's variants have an error, so a closed group still says it needs work. */
function useGroupErrorCount(indices: number[]): number {
  const { formState } = useFormContext<ProductFormValues>();
  const variantErrors = formState.errors.variants;
  return indices.filter((index) => variantErrors?.[index]).length;
}

/** The count, price range and stock of a group, e.g. ["5 variants", "$10.00 – $12.00", "8 in stock"]. */
function summaryParts(group: VariantGroupSummary, currency: string): string[] {
  const parts = [pluralize(group.indices.length, 'variant')];
  if (group.priceRange) parts.push(formatPriceRange(group.priceRange, currency));
  parts.push(`${group.totalStock.toLocaleString()} ${VARIANTS_COPY.inStock}`);
  return parts;
}

interface GroupToggleProps {
  group: VariantGroupSummary;
  optionName: string;
  currency: string;
  controls: string;
  expanded: boolean;
  onToggle: () => void;
}

/** The group's disclosure button. Its name is one phrase, e.g. "Color Red, 5 variants, …". */
function GroupToggle({
  group,
  optionName,
  currency,
  controls,
  expanded,
  onToggle,
}: GroupToggleProps) {
  const errorCount = useGroupErrorCount(group.indices);
  const parts = summaryParts(group, currency);
  const errorText = errorCount > 0 ? `${errorCount} ${VARIANTS_COPY.toFix}` : '';
  const spoken = [`${optionName} ${group.value}`, ...parts, errorText].filter(Boolean);

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={spoken.join(SPOKEN_SEPARATOR)}
      onClick={onToggle}
      className="flex min-w-0 items-center gap-2 rounded-md sm:flex-1 py-1 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <ChevronRight
        aria-hidden="true"
        className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-90')}
      />
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <span className="font-medium">{group.value}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {parts.join(SUMMARY_SEPARATOR)}
        </span>
        {errorText && <span className="text-xs text-destructive">{errorText}</span>}
      </span>
    </button>
  );
}

interface VariantGroupProps extends Omit<GroupToggleProps, 'controls'> {
  columnCount: number;
  children: ReactNode;
}

/** A disclosure of the variants that share a first option value, with a summary and bulk edit. */
export function VariantGroup({ columnCount, children, ...toggle }: VariantGroupProps) {
  const rowsId = useId();

  return (
    <>
      <TableBody>
        <TableRow className="bg-muted/40 hover:bg-muted/60">
          <TableCell colSpan={columnCount} className="py-1.5">
            {/* Below sm the table can scroll sideways, so the bulk edit sits next to the summary. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap sm:justify-between">
              <GroupToggle {...toggle} controls={rowsId} />
              <BulkVariantEditor
                indices={toggle.group.indices}
                currency={toggle.currency}
                label={VARIANTS_COPY.setForGroup}
                context={`${toggle.optionName} ${toggle.group.value}`}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
      <TableBody id={rowsId} hidden={!toggle.expanded}>
        {children}
      </TableBody>
    </>
  );
}
