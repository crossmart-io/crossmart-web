import { BillingInterval, SubscriptionAccessState, SubscriptionStatus } from '@/api/schema';

export const BILLING_STATUS_ENDPOINT = '/api/v1/organizations/{organizationId}/billing';
export const CHECKOUT_SESSIONS_ENDPOINT =
  '/api/v1/organizations/{organizationId}/billing/checkout-sessions';
export const PORTAL_SESSIONS_ENDPOINT =
  '/api/v1/organizations/{organizationId}/billing/portal-sessions';
export const BILLING_PLANS_ENDPOINT = '/api/v1/billing/plans';
export const BILLING_ACCESS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/billing-access';

/** How often the checkout success page asks whether the provider confirmed the subscription. */
export const CHECKOUT_CONFIRMATION_POLL_MS = 2_000;
/** The checkout success page stops waiting after this, and says the confirmation may be late. */
export const CHECKOUT_CONFIRMATION_TIMEOUT_MS = 60_000;
export const MS_PER_DAY = 86_400_000;

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Active',
  [SubscriptionStatus.TRIALING]: 'Trial',
  [SubscriptionStatus.PAST_DUE]: 'Payment due',
  [SubscriptionStatus.CANCELED]: 'Canceled',
  [SubscriptionStatus.INCOMPLETE]: 'No plan chosen',
  [SubscriptionStatus.UNPAID]: 'Unpaid',
  [SubscriptionStatus.PAUSED]: 'Paused',
};

/** Statuses that read as healthy; the rest are shown as a warning. */
export const GOOD_STANDING_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
]);

/** Statuses whose subscription has started and can be changed in the billing portal. */
export const LIVE_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.UNPAID,
  SubscriptionStatus.PAUSED,
]);

export const INTERVAL_LABELS: Record<BillingInterval, string> = {
  [BillingInterval.MONTHLY]: 'Monthly',
  [BillingInterval.ANNUAL]: 'Annual',
};

/** How each interval is billed, under a plan's price. */
export const INTERVAL_BILLING_NOTES: Record<BillingInterval, string> = {
  [BillingInterval.MONTHLY]: 'Billed monthly',
  [BillingInterval.ANNUAL]: 'Billed yearly',
};

/** Why a read-only organization is read-only, as a sentence. */
export const READ_ONLY_REASONS: Partial<Record<SubscriptionAccessState, string>> = {
  [SubscriptionAccessState.subscription_required]: 'No plan has been chosen yet.',
  [SubscriptionAccessState.past_due]: 'A payment is past due.',
  [SubscriptionAccessState.canceled]: 'The subscription was canceled.',
  [SubscriptionAccessState.unpaid]: 'An invoice is unpaid.',
  [SubscriptionAccessState.paused]: 'The trial ended without a payment method.',
};
export const READ_ONLY_FALLBACK_REASON = 'The subscription is not active.';

/** The machine-readable code of a 402 from a read-only organization. */
export const SUBSCRIPTION_INACTIVE_CODE = 'subscription_inactive';

export const BILLING_COPY = {
  pageName: 'Billing',
  pageDescription:
    'Your organization’s plan, its billing and how much of it is in use across all workspaces. No fees on your sales, ever.',
  noAccess: 'Only owners and admins can see the plan and its billing.',
  loadError: 'Billing could not be loaded',
  plansLoadError: 'The plans could not be loaded',
  currentPlan: 'Current plan',
  legacyPlan: 'Legacy plan',
  legacyNote:
    'This plan is no longer offered. You keep it, with its limits, until you choose one of the current plans.',
  manageBilling: 'Manage billing',
  manageBillingHint: 'Change plan, card or billing details, cancel, and download invoices.',
  choosePlan: 'Choose a plan',
  choosePlanHint: 'Card required. You can cancel any time before the trial ends.',
  startTrial: 'Start free trial',
  subscribe: 'Subscribe',
  currentPlanButton: 'Your plan',
  changeInPortal: 'Change your plan in Manage billing.',
  contactSales: 'Contact sales',
  enterpriseNote: 'Custom limits, contracts and invoicing.',
  perMonth: '/ month',
  billingOff: 'Billing is off on this Crossmart instance: every feature is free to use.',
  limitsEnforced: 'Actions that would go past a limit are refused until the plan is upgraded.',
  limitsNotEnforced:
    'Limits are not enforced yet: going past one is shown here but never blocks you.',
  billingAction: 'Billing',
  checkoutSuccessTitle: 'Thank you',
  checkoutSuccessWaiting: 'Confirming your subscription with our payment provider…',
  checkoutSuccessDone: 'Your subscription is confirmed.',
  checkoutSuccessLate:
    'The payment provider has not confirmed it yet. It usually takes a few seconds; check Billing again shortly.',
  checkoutCanceledTitle: 'Checkout canceled',
  checkoutCanceledBody: 'Nothing was charged. You can choose a plan whenever you are ready.',
  backToBilling: 'Back to billing',
} as const;
