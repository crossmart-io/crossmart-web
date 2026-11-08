/** What a notice is about. Together with its scope, it makes the notice's stable key. */
export enum NoticeKind {
  SandboxClaim = 'sandbox-claim',
  Trial = 'trial',
  PaymentFailed = 'payment-failed',
  LegacyAccessEnding = 'legacy-access-ending',
  PlanRequired = 'plan-required',
  ReadOnly = 'read-only',
  VerifyEmail = 'verify-email',
  /** Outside AI agents' changes wait for a decision (ADR 0028). */
  AgentProposals = 'agent-proposals',
}

/** How much a notice needs attention, most urgent last. */
export enum NoticeSeverity {
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
}

export enum NoticeActionKind {
  /** A page in the app, such as Billing. */
  Link = 'link',
  ResendVerification = 'resend-verification',
  ClaimSandbox = 'claim-sandbox',
}

export type NoticeAction =
  | { kind: NoticeActionKind.Link; label: string; to: string }
  | { kind: NoticeActionKind.ResendVerification; email: string }
  | { kind: NoticeActionKind.ClaimSandbox; workspaceId: string };

/** Something about the account the person should know, listed in the bell. */
export interface AccountNotice {
  /** Stable while the condition lasts, such as `trial:<organizationId>`. */
  key: string;
  kind: NoticeKind;
  severity: NoticeSeverity;
  title: string;
  body: string;
  /**
   * The facts behind the notice, such as the trial's end date and whether it is cancelled. Seen
   * state compares it, not the wording, so a daily countdown does not make the notice new again.
   */
  revision: string;
  /** Also shown above every page: it stops work, or a deadline is close. */
  banner: boolean;
  /** Null when the person cannot act on it themselves. */
  action: NoticeAction | null;
}
