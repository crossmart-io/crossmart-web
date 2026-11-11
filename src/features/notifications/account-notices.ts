import { WorkspacePermission } from '@/api/schema';
import type { SubscriptionAccess } from '@/features/billing';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { ProductStoreFilter } from '@/api/schema';
import type { AttentionCounts } from '@/features/attention';
import { ReviewSource, ROUTES, toAgentReviewRoute, toProductsRoute } from '@/config/routes';
import { formatDate } from '@/lib/format';
import { billingNotice } from './billing-notice';
import { noticeRevision } from './notice-revision';
import {
  AGENT_PROPOSALS_NOTICE_COPY,
  AI_SUGGESTIONS_NOTICE_COPY,
  FAILED_LISTINGS_NOTICE_COPY,
  SANDBOX_NOTICE_COPY,
  STORES_NOTICE_COPY,
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
  /** What needs the merchant, from the attention summary; 0 for sections they cannot see. */
  attention: AttentionCounts;
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

interface CountNoticeSpec {
  kind: NoticeKind;
  severity: NoticeSeverity;
  title: string;
  body: string;
  label: string;
  to: string;
}

/** A notice about things to act on, new again whenever their number changes. */
function countNotice(
  workspace: Workspace | undefined,
  count: number,
  spec: CountNoticeSpec,
): AccountNotice | null {
  if (!workspace || count === 0) return null;
  return {
    key: `${spec.kind}:${workspace.id}`,
    kind: spec.kind,
    severity: spec.severity,
    banner: false,
    title: spec.title,
    body: spec.body,
    revision: noticeRevision(String(count)),
    action: { kind: NoticeActionKind.Link, label: spec.label, to: spec.to },
  };
}

/** Stores to reconnect, refused listings, and changes waiting for review (ADR 0028). */
function attentionNotices(workspace: Workspace | undefined, attention: AttentionCounts) {
  return [
    countNotice(workspace, attention.stores, {
      kind: NoticeKind.StoresAttention,
      severity: NoticeSeverity.Warning,
      ...STORES_NOTICE_COPY,
      title: STORES_NOTICE_COPY.title(attention.stores),
      body: STORES_NOTICE_COPY.body(attention.stores),
      to: ROUTES.stores,
    }),
    countNotice(workspace, attention.listings, {
      kind: NoticeKind.FailedListings,
      severity: NoticeSeverity.Warning,
      ...FAILED_LISTINGS_NOTICE_COPY,
      body: FAILED_LISTINGS_NOTICE_COPY.body(attention.listings),
      to: toProductsRoute({ storeFilter: ProductStoreFilter.with_errors }),
    }),
    countNotice(workspace, attention.proposals, {
      kind: NoticeKind.AgentProposals,
      severity: NoticeSeverity.Info,
      ...AGENT_PROPOSALS_NOTICE_COPY,
      body: AGENT_PROPOSALS_NOTICE_COPY.body(attention.proposals),
      to: toAgentReviewRoute(ReviewSource.Proposals),
    }),
    countNotice(workspace, attention.suggestions, {
      kind: NoticeKind.AiSuggestions,
      severity: NoticeSeverity.Info,
      ...AI_SUGGESTIONS_NOTICE_COPY,
      body: AI_SUGGESTIONS_NOTICE_COPY.body(attention.suggestions),
      to: toAgentReviewRoute(ReviewSource.Suggestions),
    }),
  ];
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
    ...attentionNotices(input.workspace, input.attention),
  ]
    .filter((notice): notice is AccountNotice => notice !== null)
    .sort(bySeverity);
}
