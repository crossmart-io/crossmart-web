import { useMemo } from 'react';
import { useSession } from '@/features/auth';
import { useAttentionCounts } from '@/features/attention';
import { useBillingAccess } from '@/features/billing';
import { useCurrentWorkspace } from '@/features/workspaces';
import { useNow } from '@/hooks/useNow';
import { accountNotices } from '../account-notices';
import type { AccountNotice } from '../notifications.types';

/**
 * The account's notices, one source for the bell and the banners: a sandbox to claim, billing
 * that needs attention, an email to confirm, and what needs the merchant, counted by the same
 * attention summary as Home and the sidebar.
 */
export function useAccountNotices(): AccountNotice[] {
  const { data: session } = useSession();
  const { workspace } = useCurrentWorkspace();
  const { data: access } = useBillingAccess(workspace?.id);
  const attention = useAttentionCounts(workspace?.id);
  const now = useNow();
  const user = session?.user;
  return useMemo(
    () => accountNotices({ user, workspace, access, attention, now }),
    [user, workspace, access, attention, now],
  );
}
