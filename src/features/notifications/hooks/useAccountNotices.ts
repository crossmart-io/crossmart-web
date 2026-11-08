import { useMemo } from 'react';
import { useSession } from '@/features/auth';
import { useBillingAccess } from '@/features/billing';
import { WorkspacePermission } from '@/api/schema';
import { usePendingProposalCount } from '@/features/agent-proposals';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { useNow } from '@/hooks/useNow';
import { accountNotices } from '../account-notices';
import type { AccountNotice } from '../notifications.types';

/**
 * The account's notices, one source for the bell and the banners: a sandbox to claim, billing
 * that needs attention, an email to confirm, and agents' proposals waiting for a decision.
 */
export function useAccountNotices(): AccountNotice[] {
  const { data: session } = useSession();
  const { workspace } = useCurrentWorkspace();
  const { data: access } = useBillingAccess(workspace?.id);
  const now = useNow();
  const canSeeProposals =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.suggestions_view);
  const pendingProposals = usePendingProposalCount(workspace?.id, canSeeProposals);
  const user = session?.user;
  return useMemo(
    () => accountNotices({ user, workspace, access, pendingProposals, now }),
    [user, workspace, access, pendingProposals, now],
  );
}
