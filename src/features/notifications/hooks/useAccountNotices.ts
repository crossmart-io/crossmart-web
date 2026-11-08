import { useMemo } from 'react';
import { useSession } from '@/features/auth';
import { useBillingAccess } from '@/features/billing';
import { useCurrentWorkspace } from '@/features/workspaces';
import { useNow } from '@/hooks/useNow';
import { accountNotices } from '../account-notices';
import type { AccountNotice } from '../notifications.types';

/**
 * The account's notices, one source for the bell and the banners: a sandbox to claim, billing
 * that needs attention, and an email to confirm.
 */
export function useAccountNotices(): AccountNotice[] {
  const { data: session } = useSession();
  const { workspace } = useCurrentWorkspace();
  const { data: access } = useBillingAccess(workspace?.id);
  const now = useNow();
  const user = session?.user;
  return useMemo(
    () => accountNotices({ user, workspace, access, now }),
    [user, workspace, access, now],
  );
}
