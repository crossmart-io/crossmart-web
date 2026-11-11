import { Undo2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FieldOrigin } from '../../listing-editor';
import { LISTING_EDITOR_COPY } from '../../listings.constants';
import { FieldOriginBadge } from './FieldOriginBadge';

interface InheritedFieldProps {
  /** The field's name, so "Use product value" says which field it brings back. */
  name: string;
  /** The field's label: a `FieldLabel` or a legend-like heading. */
  label: ReactNode;
  origin: FieldOrigin;
  /** Brings back the product's value; absent when the field cannot be changed (read-only). */
  onUseProductValue?: () => void;
  /** The product's value, shown beside a changed field so the difference is plain. */
  productValue?: ReactNode;
  children: ReactNode;
}

/**
 * One field of a listing: what it shows in this store, whether that comes from the product or
 * was changed here, and the way back to the product's value. Changed fields carry an accent bar.
 */
export function InheritedField({
  name,
  label,
  origin,
  onUseProductValue,
  productValue,
  children,
}: InheritedFieldProps) {
  const changed = origin === FieldOrigin.Store;
  return (
    <div
      data-origin={origin}
      className={cn(
        'flex min-w-0 flex-col gap-2 border-l-2 pl-3',
        changed ? 'border-primary' : 'border-transparent',
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        {label}
        <FieldOriginBadge origin={origin} />
      </div>
      {children}
      {changed && (productValue !== undefined || onUseProductValue) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {productValue !== undefined && (
            <span className="min-w-0 break-words">
              {LISTING_EDITOR_COPY.productValue} {productValue}
            </span>
          )}
          {onUseProductValue && (
            <Button
              type="button"
              variant="link"
              size="xs"
              className="h-auto p-0 text-xs"
              aria-label={`${LISTING_EDITOR_COPY.useProductValue} for ${name.toLowerCase()}`}
              onClick={onUseProductValue}
            >
              <Undo2 data-icon="inline-start" aria-hidden="true" />
              {LISTING_EDITOR_COPY.useProductValue}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
