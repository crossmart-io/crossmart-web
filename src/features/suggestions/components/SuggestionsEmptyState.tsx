import { Inbox } from 'lucide-react';
import { Link } from 'react-router';
import { SuggestionStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ROUTES } from '@/config/routes';
import { SUGGESTION_STATUS_LABELS } from '../suggestions.constants';

/** No suggestions with this status: an empty inbox explains where suggestions come from. */
export function SuggestionsEmptyState({ status }: { status: SuggestionStatus }) {
  if (status !== SuggestionStatus.PENDING) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>No {SUGGESTION_STATUS_LABELS[status].toLowerCase()} suggestions</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Nothing to review</EmptyTitle>
        <EmptyDescription>
          Select products and choose Generate with AI, or open a product’s store settings. The
          titles and descriptions AI writes wait here until you approve them.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link to={ROUTES.products}>Go to products</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
