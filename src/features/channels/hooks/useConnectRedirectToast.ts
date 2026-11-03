import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { CHANNEL_FEEDBACK } from '../channels.constants';
import { CONNECT_REDIRECT_PARAMS, readConnectOutcome } from '../connect-redirect';

/** One toast per outcome, even when strict mode runs the effect twice. */
const OUTCOME_TOAST_ID = 'channel-connect-outcome';

/**
 * Shows the outcome of an OAuth round trip once, then removes its parameters from the URL so
 * a reload or a shared link does not repeat it.
 */
export function useConnectRedirectToast(): void {
  const [params] = useSearchParams();
  const updateParams = useSearchParamsUpdater();

  useEffect(() => {
    const outcome = readConnectOutcome(params);
    if (!outcome) return;
    if (outcome.kind === 'connected') {
      toast.success(outcome.message, { id: OUTCOME_TOAST_ID });
    } else {
      toast.error(CHANNEL_FEEDBACK.connectFailedTitle, {
        id: OUTCOME_TOAST_ID,
        description: outcome.message,
      });
    }
    updateParams((next) => {
      Object.values(CONNECT_REDIRECT_PARAMS).forEach((name) => next.delete(name));
    });
  }, [params, updateParams]);
}
