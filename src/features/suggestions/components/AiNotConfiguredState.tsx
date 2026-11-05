import { KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { AI_COPY } from '../suggestions.constants';

/** The inbox when AI is off and there is nothing to review: how to turn it on. */
export function AiNotConfiguredState() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyRound />
        </EmptyMedia>
        <EmptyTitle>{AI_COPY.notConfiguredTitle}</EmptyTitle>
        <EmptyDescription>{AI_COPY.notConfiguredDescription}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** A note above earlier suggestions while AI is off, as new ones cannot arrive. */
export function AiNotConfiguredAlert() {
  return (
    <Alert>
      <KeyRound />
      <AlertTitle>{AI_COPY.notConfiguredTitle}</AlertTitle>
      <AlertDescription>{AI_COPY.notConfiguredDescription}</AlertDescription>
    </Alert>
  );
}
