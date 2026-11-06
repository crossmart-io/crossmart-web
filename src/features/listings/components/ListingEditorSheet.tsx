import { Undo2 } from 'lucide-react';
import { FormProvider, useFormState, useWatch } from 'react-hook-form';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useListingEditor } from '../hooks/useListingEditor';
import { useListingEditorForm } from '../hooks/useListingEditorForm';
import type { ProductChannelRef } from '../hooks/useProductChannels';
import { hasListingChanges, listingChanges } from '../listing-editor';
import { LISTING_EDITOR_COPY, OverrideSheetMode } from '../listings.constants';
import { type OverrideFormValues, productDefaultsOf } from '../override-form';
import type { ListingEditor } from '../listings.types';
import { ListingEditorFields } from './editor/ListingEditorFields';
import { ListingEditorHeader } from './editor/ListingEditorHeader';
import { ListingEditorContext } from './editor/listing-editor-context';

export interface ListingEditorSheetProps {
  listingRef: ProductChannelRef;
  /** The workspace's currency, which the product's prices are in. */
  catalogCurrency: string;
  /** Whether the member may edit listings; otherwise the editor only shows the listing. */
  canEdit: boolean;
  /** Adding saves any changes first, then adds the product, so it is published with them. */
  mode?: OverrideSheetMode;
  /** A link to the product's page, for when the editor opens away from it. */
  showProductLink?: boolean;
  onClose: () => void;
}

interface FooterProps {
  isAdding: boolean;
  onUseProductValues: () => void;
}

/** Following the product everywhere again, and saving, or adding the product with the changes. */
function ListingEditorFooter({ isAdding, onUseProductValues }: FooterProps) {
  const values = useWatch<OverrideFormValues>() as OverrideFormValues;
  const { isDirty, isSubmitting } = useFormState<OverrideFormValues>();
  return (
    <SheetFooter className="flex-row flex-wrap justify-between gap-2 border-t">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!hasListingChanges(listingChanges(values))}
        onClick={onUseProductValues}
      >
        <Undo2 data-icon="inline-start" />
        {LISTING_EDITOR_COPY.resetAll}
      </Button>
      <Button type="submit" size="sm" disabled={isSubmitting || (!isAdding && !isDirty)}>
        {isSubmitting && <Spinner data-icon="inline-start" />}
        {isAdding ? LISTING_EDITOR_COPY.add : LISTING_EDITOR_COPY.save}
      </Button>
    </SheetFooter>
  );
}

type LoadedEditorProps = Omit<ListingEditorSheetProps, 'catalogCurrency'> & {
  catalogCurrency: string;
  data: ListingEditor;
};

/** The editor once the product and its listing have loaded: header, fields and footer. */
function LoadedListingEditor({ data, ...props }: LoadedEditorProps) {
  const { listingRef, catalogCurrency, canEdit, showProductLink = false, onClose } = props;
  const isAdding = props.mode === OverrideSheetMode.Add;
  const editor = useListingEditorForm({ listingRef, listing: data, isAdding, onAdded: onClose });
  const context = {
    listingRef,
    listing: data,
    productDefaults: productDefaultsOf(data),
    catalogCurrency,
    readOnly: !canEdit,
  };
  return (
    <ListingEditorContext.Provider value={context}>
      <FormProvider {...editor.form}>
        <form onSubmit={editor.submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ListingEditorHeader isAdding={isAdding} showProductLink={showProductLink} />
            <ListingEditorFields error={editor.error} />
          </div>
          {canEdit && (
            <ListingEditorFooter
              isAdding={isAdding}
              onUseProductValues={editor.useProductValuesEverywhere}
            />
          )}
        </form>
      </FormProvider>
    </ListingEditorContext.Provider>
  );
}

/** What the sheet shows before the listing is there to edit: loading, an error, or a gone store. */
function EditorPlaceholder({ query }: { query: ReturnType<typeof useListingEditor> }) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{LISTING_EDITOR_COPY.loading}</SheetTitle>
        <SheetDescription className="sr-only">{LISTING_EDITOR_COPY.loading}</SheetDescription>
      </SheetHeader>
      <div className="px-4">
        {query.isPending && <Skeleton className="h-64 w-full" />}
        {query.error !== null && (
          <ErrorState
            title={LISTING_EDITOR_COPY.loadFailed}
            error={query.error}
            onRetry={query.refetch}
          />
        )}
        {query.isMissing && (
          <p className="text-sm text-muted-foreground">{LISTING_EDITOR_COPY.notFound}</p>
        )}
      </div>
    </>
  );
}

/**
 * The listing editor: one product in one store. Each field shows the product's value, or the
 * store's change with the way back to the product's. Opens from the store's listings and from
 * the product's page alike, and shows the listing's state live while it is open.
 */
export function ListingEditorSheet(props: ListingEditorSheetProps) {
  const query = useListingEditor(props.listingRef);
  const { data } = query;
  return (
    <Sheet open onOpenChange={(open) => !open && props.onClose()}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        {data ? (
          <LoadedListingEditor
            // A different product or store starts the form over from its values.
            key={`${data.productId}:${data.connection.id}`}
            {...props}
            data={data}
          />
        ) : (
          <EditorPlaceholder query={query} />
        )}
      </SheetContent>
    </Sheet>
  );
}
