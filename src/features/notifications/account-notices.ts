import { WorkspacePermission } from '@/api/schema';
import type { SubscriptionAccess } from '@/features/billing';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { formatDate } from '@/lib/format';
import { billingNotice } from './billing-notice';
import { noticeRevision } from './notice-revision';
import {
  SANDBOX_NOTICE_COPY,
  SEVERITY_RANK,
  VERIFY_EMAIL_NOTICE_COPY,
} from './notifications.constants';
import {
  type AccountNotice,
  NoticeActionKind,
  NoticeKind,
  NoticeSeverity,
} from './notifications.types';

export interface NoticeUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface AccountNoticeInput {
  user: NoticeUser | undefined;
  workspace: Workspace | undefined;
  access: SubscriptionAccess | undefined;
  now: Date;
}

/** A sandbox an AI agent opened: connecting stores, publishing and inviting wait for the claim. */
function sandboxNotice(workspace: Workspace | undefined): AccountNotice | null {
  if (!workspace?.sandbox) return null;
  return {
    key: `${NoticeKind.SandboxClaim}:${workspace.id}`,
    kind: NoticeKind.SandboxClaim,
    severity: NoticeSeverity.Warning,
    banner: true,
    title: SANDBOX_NOTICE_COPY.title,
    body: SANDBOX_NOTICE_COPY.body(formatDate(workspace.sandbox.claimExpiresAt)),
    revision: noticeRevision(workspace.sandbox.claimExpiresAt),
    action: { kind: NoticeActionKind.ClaimSandbox, workspaceId: workspace.id },
  };
}

function workspaceBillingNotice(input: AccountNoticeInput): AccountNotice | null {
  const { workspace, access, now } = input;
  if (!workspace || !access) return null;
  const canManage = hasPermission(workspace, WorkspacePermission.billing_manage);
  return billingNotice({ access, organizationId: workspace.organizationId, canManage, now });
}

function verifyEmailNotice(user: NoticeUser | undefined): AccountNotice | null {
  if (!user || user.emailVerified) return null;
  return {
    key: `${NoticeKind.VerifyEmail}:${user.id}`,
    kind: NoticeKind.VerifyEmail,
    severity: NoticeSeverity.Info,
    banner: false,
    title: VERIFY_EMAIL_NOTICE_COPY.title,
    body: VERIFY_EMAIL_NOTICE_COPY.body(user.email),
    revision: noticeRevision(user.email),
    action: { kind: NoticeActionKind.ResendVerification, email: user.email },
  };
}

function bySeverity(first: AccountNotice, second: AccountNotice): number {
  return SEVERITY_RANK[first.severity] - SEVERITY_RANK[second.severity];
}

/** Every notice that applies now, the most urgent first. */
export function accountNotices(input: AccountNoticeInput): AccountNotice[] {
  return [
    sandboxNotice(input.workspace),
    workspaceBillingNotice(input),
    verifyEmailNotice(input.user),
  ]
    .filter((notice): notice is AccountNotice => notice !== null)
    .sort(bySeverity);
}
