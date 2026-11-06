import type { ReactNode } from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { VariantGroupsState } from '../useVariantGroups';
import { VARIANTS_COPY } from '../variants.constants';
import { VariantGroup } from './VariantGroup';

interface VariantRowsProps {
  layout: VariantGroupsState;
  currency: string;
  columnCount: number;
  renderRow: (index: number) => ReactNode;
}

/** The grid's body: the visible variants, flat or in groups by the first option. */
export function VariantRows({
  layout,

  currency,
  columnCount,
  renderRow,
}: VariantRowsProps) {
  if (layout.visibleIndices.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnCount} className="py-6 text-center text-muted-foreground">
            {VARIANTS_COPY.noMatches}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  if (!layout.grouped) return <TableBody>{layout.visibleIndices.map(renderRow)}</TableBody>;

  return layout.groups.map((group) => (
    <VariantGroup
      key={group.value}
      group={group}
      optionName={layout.groupOptionName}
      currency={currency}
      columnCount={columnCount}
      expanded={layout.isExpanded(group.value)}
      onToggle={() => layout.toggle(group.value)}
    >
      {group.indices.map(renderRow)}
    </VariantGroup>
  ));
}
