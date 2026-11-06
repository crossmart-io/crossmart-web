import { CircleAlert, Clock, CloudOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EXTERNAL_LINKS } from '@/config/links';
import { ASK_COPY, ASK_FAILURE_TITLES } from '../ask.constants';
import { AskFailure, type AskFailureDetails } from '../ask.types';

const FAILURE_ICONS: Record<AskFailure, LucideIcon> = {
  [AskFailure.RateLimited]: Clock,
  [AskFailure.Unavailable]: CloudOff,
  [AskFailure.Offline]: CloudOff,
  [AskFailure.Failed]: CircleAlert,
};

/** Why a question got no answer, and the docs as a way forward meanwhile. */
export function AskFailureNotice({ failure, message }: AskFailureDetails) {
  const Icon = FAILURE_ICONS[failure];
  return (
    <Alert variant={failure === AskFailure.Failed ? 'destructive' : 'default'}>
      <Icon />
      <AlertTitle>{ASK_FAILURE_TITLES[failure]}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        <a
          href={EXTERNAL_LINKS.docs}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {ASK_COPY.browseDocs}
          <span className="sr-only"> {ASK_COPY.opensInNewTab}</span>
        </a>
      </AlertDescription>
    </Alert>
  );
}
