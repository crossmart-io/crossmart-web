import { ExternalLink, SquareArrowOutUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useReturnToState } from '@/components/navigation/return-to';
import { toProductRoute } from '@/config/routes';
import { AI_WRITER_COPY, ALL_CONTENT_FIELDS, AiRewriteButton } from '@/features/ai-writer';
import { needsReconnect } from '@/features/channels/connection-status';
import { useOverrideAiWriter } from '../../hooks/useOverrideAiWriter';
import { listingFixOf } from '../../listing-fix';
import {
  LISTING_EDITOR_COPY,
  LISTING_SOURCE_LABELS,
  ListingEditorSection,
} from '../../listings.constants';
import { ListingIssue } from '../ListingIssue';
import { ListingStateBadge } from '../ListingStateBadge';
import { RemoveFromStoreButton } from '../RemoveFromStoreButton';
import { StoreName } from '../StoreName';
import { ListingChangesSummary } from './ListingChangesSummary';
import { useListingEditorContext } from './listing-editor-context';

/** Moves the editor to the fields only this store has, where a category or specifics are fixed. */
function scrollToStoreOnlyFields(): void {
  document
    .getElementById(ListingEditorSection.StoreOnly)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Where the listing stands in the store, live, with why and the fix when it needs one. */
function ListingState({
  storeMissing,
}: {
  storeMissing: ListingEditorHeaderProps['storeMissing'];
}) {
  const { listingRef, channel, readOnly } = useListingEditorContext();
  const fix = listingFixOf({
    displayState: channel.displayState,
    missingRequirement: channel.listing?.missingRequirement,
    storeMissing,
  });
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap items-center gap-2" aria-live="polite">
        <ListingStateBadge state={channel.displayState} />
        {channel.selected && channel.listing && (
          <span className="text-xs text-muted-foreground">
            {LISTING_SOURCE_LABELS[channel.listing.source]}
          </span>
        )}
      </div>
      <ListingIssue
        state={channel.displayState}
        reason={channel.displayReason}
        fix={fix}
        listing={listingRef}
        canEdit={!readOnly}
        canRetry={!needsReconnect(channel.connection.status)}
        onOpenOverride={scrollToStoreOnlyFields}
      />
    </div>
  );
}

/** Ways out of the editor: the product's page, the live listing, and taking it off the store. */
function ListingLinks({ showProductLink }: { showProductLink: boolean }) {
  const { listingRef, channel, readOnly } = useListingEditorContext();
  const returnTo = useReturnToState();
  const externalUrl = channel.listing?.externalUrl;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {showProductLink && (
        <Button asChild variant="ghost" size="xs">
          <Link to={toProductRoute(listingRef.productId)} state={returnTo}>
            <SquareArrowOutUpRight data-icon="inline-start" />
            {LISTING_EDITOR_COPY.openProduct}
          </Link>
        </Button>
      )}
      {externalUrl && (
        <Button asChild variant="ghost" size="xs">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" />
            {LISTING_EDITOR_COPY.viewInStore}
          </a>
        </Button>
      )}
      {channel.selected && !readOnly && (
        <RemoveFromStoreButton listingRef={listingRef} store={channel.connection.displayName} />
      )}
    </div>
  );
}

/** Rewrites this store's title and description with AI, into the form and unsaved. */
function WriteAllWithAi() {
  const { listingRef, readOnly } = useListingEditorContext();
  const writer = useOverrideAiWriter();
  if (readOnly) return null;
  return (
    <AiRewriteButton
      target={listingRef}
      fields={ALL_CONTENT_FIELDS}
      label={AI_WRITER_COPY.writeAll}
      prominent
      {...writer}
    />
  );
}

interface ListingEditorHeaderProps {
  isAdding: boolean;
  showProductLink: boolean;
  storeMissing: Parameters<typeof listingFixOf>[0]['storeMissing'];
}

/** The product, the store it is in, its state there, and what differs from the product. */
export function ListingEditorHeader({
  isAdding,
  showProductLink,
  storeMissing,
}: ListingEditorHeaderProps) {
  const { product, channel } = useListingEditorContext();
  const store = channel.connection.displayName;
  return (
    <SheetHeader className="gap-3 border-b pr-12">
      <StoreName connection={channel.connection} />
      <div className="flex flex-col gap-1">
        <SheetTitle dir="auto" className="line-clamp-2 break-words">
          {product.title}
        </SheetTitle>
        <SheetDescription>
          {isAdding ? LISTING_EDITOR_COPY.addingTo(store) : LISTING_EDITOR_COPY.editingIn(store)}
        </SheetDescription>
      </div>
      <ListingState storeMissing={storeMissing} />
      <ListingLinks showProductLink={showProductLink} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ListingChangesSummary />
        <WriteAllWithAi />
      </div>
    </SheetHeader>
  );
}
