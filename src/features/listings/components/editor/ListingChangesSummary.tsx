import { useFormContext, useWatch } from 'react-hook-form';
import { hasListingChanges, listingChanges } from '../../listing-editor';
import { LISTING_EDITOR_COPY, LISTING_FIELD_LABELS } from '../../listings.constants';
import type { OverrideFormValues } from '../../override-form';

/** Which fields differ in this store, as the form holds them now, in one line. */
export function ListingChangesSummary() {
  const { control } = useFormContext<OverrideFormValues>();
  const values = useWatch({ control }) as OverrideFormValues;
  const changes = listingChanges(values);
  if (!hasListingChanges(changes)) {
    return (
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {LISTING_EDITOR_COPY.noChanges}
      </p>
    );
  }
  const names: string[] = changes.fields.map((field) => LISTING_FIELD_LABELS[field]);
  if (changes.pricedVariants > 0)
    names.push(LISTING_EDITOR_COPY.pricedVariants(changes.pricedVariants));
  return (
    <p className="text-xs" aria-live="polite">
      <span className="font-medium">{LISTING_EDITOR_COPY.changesLabel}</span> {names.join(', ')}
    </p>
  );
}
