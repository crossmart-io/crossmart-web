import { ChevronDown, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { cn } from 'cn';
import type { ProductChannelRef } from '../hooks/useProductChannels';
import { useItemSpecifics, useSaveItemSpecifics } from '../hooks/useItemSpecifics';
import {
  groupAspects,
  type ItemSpecificValues,
  missingRequired,
  sameItemSpecifics,
  toItemSpecificsBody,
  toItemSpecificValues,
} from '../item-specifics-form';
import { ITEM_SPECIFICS_COPY } from '../listings.constants';
import type { CategoryAspect, ListingItemSpecifics } from '../listings.types';
import { ItemSpecificField } from './ItemSpecificField';

const NAME_SEPARATOR = ', ';

interface ItemSpecificsSectionProps {
  channelRef: ProductChannelRef;
  /** Whether the listing has an eBay category; its aspects are read only then. */
  hasCategory: boolean;
  /** Prefills Brand when none is saved. */
  vendor: string | null;
}

interface AspectListProps {
  aspects: readonly CategoryAspect[];
  values: ItemSpecificValues;
  onChange: (name: string, values: string[]) => void;
}

function AspectList({ aspects, values, onChange }: AspectListProps) {
  return (
    <FieldGroup className="gap-4">
      {aspects.map((aspect) => (
        <ItemSpecificField
          key={aspect.name}
          aspect={aspect}
          values={values[aspect.name] ?? []}
          onChange={(next) => onChange(aspect.name, next)}
        />
      ))}
    </FieldGroup>
  );
}

/** Recommended and optional aspects, folded away until the merchant asks for them or sets one. */
function MoreAspects(props: AspectListProps) {
  const [open, setOpen] = useState(() =>
    props.aspects.some((aspect) => (props.values[aspect.name] ?? []).length > 0),
  );
  if (props.aspects.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="ghost"
        className="self-start px-0"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown data-icon="inline-start" className={cn(open && 'rotate-180')} />
        {open ? ITEM_SPECIFICS_COPY.moreHide : ITEM_SPECIFICS_COPY.moreShow} ({props.aspects.length}
        )
      </Button>
      {open && <AspectList {...props} />}
    </div>
  );
}

function MissingRequired({ names }: { names: readonly string[] }) {
  if (names.length === 0) return null;
  return (
    <p className="text-sm text-warning">
      {ITEM_SPECIFICS_COPY.missing} {names.join(NAME_SEPARATOR)}
    </p>
  );
}

function SaveError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}

/** The editable values of one category's aspects, saved with their own button. */
function ItemSpecificsForm({
  channelRef,
  view,
  vendor,
}: {
  channelRef: ProductChannelRef;
  view: ListingItemSpecifics;
  vendor: string | null;
}) {
  const [initial] = useState(() => toItemSpecificValues(view.aspects, view.itemSpecifics, vendor));
  const [values, setValues] = useState(initial);
  const save = useSaveItemSpecifics(channelRef);
  const { required, more } = groupAspects(view.aspects);
  const onChange = (name: string, next: string[]) => setValues({ ...values, [name]: next });
  if (view.aspects.length === 0) {
    return <FieldDescription>{ITEM_SPECIFICS_COPY.empty}</FieldDescription>;
  }
  return (
    <>
      <AspectList aspects={required} values={values} onChange={onChange} />
      <MoreAspects aspects={more} values={values} onChange={onChange} />
      <MissingRequired names={missingRequired(view.aspects, values)} />
      <SaveError error={save.error} />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={save.isPending || sameItemSpecifics(values, initial)}
          onClick={() => void save.mutateAsync(toItemSpecificsBody(values))}
        >
          {save.isPending && <Spinner data-icon="inline-start" />}
          {ITEM_SPECIFICS_COPY.save}
        </Button>
        <FieldDescription>{ITEM_SPECIFICS_COPY.savedNote}</FieldDescription>
      </div>
    </>
  );
}

/**
 * The eBay item specifics of the listing's category: required ones first and marked, the rest
 * folded under "More specifics". Saved apart from the sheet's other fields, like the category.
 */
export function ItemSpecificsSection({
  channelRef,
  hasCategory,
  vendor,
}: ItemSpecificsSectionProps) {
  const query = useItemSpecifics(channelRef, hasCategory);
  if (!hasCategory) return null;
  return (
    <FieldSet>
      <FieldLegend>{ITEM_SPECIFICS_COPY.title}</FieldLegend>
      <FieldDescription>{ITEM_SPECIFICS_COPY.description}</FieldDescription>
      {query.isPending && <Skeleton className="h-24 w-full" />}
      <SaveError error={query.error} />
      {query.data && (
        // Remount when the saved values or the category change, so the form starts from them.
        <ItemSpecificsForm
          key={query.dataUpdatedAt}
          channelRef={channelRef}
          view={query.data}
          vendor={vendor}
        />
      )}
    </FieldSet>
  );
}
