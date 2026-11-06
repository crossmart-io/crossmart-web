import type { ReactNode } from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { VariantGroupsState } from '../useVariantGroups';
import { GROUP_ROW_CLASSES, VARIANTS_COPY } from '../variants.constants';
import { cn } from '@/lib/utils';
import { VariantGroup } from './VariantGroup';

interface VariantRowsProps {
  layout: VariantGroupsState;
  currency: string;
  columnCount: number;
  /** Classes for each table body, e.g. to stack the rows on phones. */
  bodyClassName?: string;
  renderRow: (index: number) => ReactNode;
}

/** The grid's body: the visible variants, flat or in groups by the first option. */
export function VariantRows({
  layout,
  currency,
  columnCount,
  bodyClassName,
  renderRow,
}: VariantRowsProps) {
  if (layout.visibleIndices.length === 0) {
    return (
      <TableBody className={bodyClassName}>
        <TableRow className={GROUP_ROW_CLASSES.row}>
          <TableCell
            colSpan={columnCount}
            className={cn(GROUP_ROW_CLASSES.cell, 'py-6 text-center text-muted-foreground')}
          >
            {VARIANTS_COPY.noMatches}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  if (!layout.grouped) {
    return <TableBody className={bodyClassName}>{layout.visibleIndices.map(renderRow)}</TableBody>;
  }

  return layout.groups.map((group) => (
    <VariantGroup
      key={group.value}
      group={group}
      optionName={layout.groupOptionName}
      currency={currency}
      columnCount={columnCount}
      bodyClassName={bodyClassName}
      expanded={layout.isExpanded(group.value)}
      onToggle={() => layout.toggle(group.value)}
    >
      {group.indices.map(renderRow)}
    </VariantGroup>
  ));
}
