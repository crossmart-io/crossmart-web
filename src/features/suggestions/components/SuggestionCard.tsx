import { Check, X } from 'lucide-react';
import { Link } from 'react-router';
import { SuggestionStatus } from '@/api/schema';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { toProductRoute } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog/components/ProductThumbnail';
import { SUGGESTION_AGENT_LABELS, SUGGESTION_KIND_LABELS } from '../suggestions.constants';
import type { Suggestion } from '../suggestions.types';
import { SuggestionDiff } from './SuggestionDiff';
import { SuggestionStatusBadge } from './SuggestionStatusBadge';

export interface SuggestionReviewActions {
  onApprove: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  /** The suggestion being reviewed right now, if any. */
  busyId: string | undefined;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  /** Absent when the user may not review suggestions. */
  review?: SuggestionReviewActions;
  selected?: boolean;
  onToggleSelected?: () => void;
}

/** Who made it: "Content Generator, asked by Dana". */
function creatorOf({ createdBy }: Suggestion): string {
  const author = createdBy.agent ? SUGGESTION_AGENT_LABELS[createdBy.agent] : createdBy.name;
  return createdBy.agent && createdBy.name
    ? `${author}, asked by ${createdBy.name}`
    : (author ?? '');
}

function SuggestionHeader({ suggestion }: { suggestion: Suggestion }) {
  const store = suggestion.connection?.displayName;
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <ProductThumbnail url={suggestion.imageUrl} alt="" />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={toProductRoute(suggestion.productId)}
            className="truncate font-medium hover:underline"
          >
            {suggestion.productTitle}
          </Link>
          <Badge variant="outline">{SUGGESTION_KIND_LABELS[suggestion.kind]}</Badge>
          <SuggestionStatusBadge status={suggestion.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          {store ? `${store} · ` : ''}
          {creatorOf(suggestion)} · <RelativeTime value={suggestion.createdAt} />
        </p>
      </div>
    </div>
  );
}

function ReviewButtons({
  suggestion,
  review,
}: {
  suggestion: Suggestion;
  review: SuggestionReviewActions;
}) {
  const busy = review.busyId === suggestion.id;
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => review.onReject(suggestion.id)}
      >
        <X data-icon="inline-start" />
        Reject
      </Button>
      <Button size="sm" disabled={busy} onClick={() => review.onApprove(suggestion.id)}>
        {busy ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />}
        Approve
      </Button>
    </div>
  );
}

/** One proposed change: where, what it replaces, what it proposes and why. */
export function SuggestionCard({
  suggestion,
  review,
  selected,
  onToggleSelected,
}: SuggestionCardProps) {
  const isPending = suggestion.status === SuggestionStatus.PENDING;
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {isPending && onToggleSelected && (
            <Checkbox
              checked={selected}
              onCheckedChange={onToggleSelected}
              aria-label={`Select the ${SUGGESTION_KIND_LABELS[suggestion.kind].toLowerCase()} suggestion for ${suggestion.productTitle}`}
              className="mt-3"
            />
          )}
          <SuggestionHeader suggestion={suggestion} />
          {isPending && review && <ReviewButtons suggestion={suggestion} review={review} />}
        </div>
        <SuggestionDiff
          kind={suggestion.kind}
          currentValue={suggestion.currentValue}
          proposedValue={suggestion.proposedValue}
        />
        <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
      </CardContent>
    </Card>
  );
}
