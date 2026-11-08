import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout, type RouteHandle } from '@/components/layout/page-layout';
import { ROUTES } from '@/config/routes';
import { AuthLayout, RequireSession } from '@/features/auth';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';

/** App pages load on first visit, so the sign-in screen stays small. */
const appRoutes: RouteObject[] = [
  {
    path: ROUTES.home,
    lazy: () =>
      import('@/pages/OverviewPage').then(({ OverviewPage }) => ({ Component: OverviewPage })),
  },
  {
    path: ROUTES.products,
    lazy: () =>
      import('@/pages/ProductsPage').then(({ ProductsPage }) => ({ Component: ProductsPage })),
  },
  {
    path: ROUTES.newProduct,
    lazy: () =>
      import('@/pages/NewProductPage').then(({ NewProductPage }) => ({
        Component: NewProductPage,
      })),
  },
  {
    path: ROUTES.product,
    lazy: () =>
      import('@/pages/EditProductPage').then(({ EditProductPage }) => ({
        Component: EditProductPage,
      })),
  },
  {
    path: ROUTES.orders,
    lazy: () => import('@/pages/OrdersPage').then(({ OrdersPage }) => ({ Component: OrdersPage })),
  },
  {
    path: ROUTES.order,
    lazy: () => import('@/pages/OrderPage').then(({ OrderPage }) => ({ Component: OrderPage })),
  },
  {
    path: ROUTES.account,
    lazy: () =>
      import('@/pages/AccountPage').then(({ AccountPage }) => ({ Component: AccountPage })),
  },
  {
    path: ROUTES.inventory,
    lazy: () =>
      import('@/pages/InventoryPage').then(({ InventoryPage }) => ({ Component: InventoryPage })),
  },
  {
    path: ROUTES.imports,
    lazy: () =>
      import('@/pages/ImportsPage').then(({ ImportsPage }) => ({ Component: ImportsPage })),
  },
  {
    path: ROUTES.importJob,
    lazy: () =>
      import('@/pages/ImportJobPage').then(({ ImportJobPage }) => ({ Component: ImportJobPage })),
  },
  {
    path: ROUTES.channels,
    lazy: () =>
      import('@/pages/ChannelsPage').then(({ ChannelsPage }) => ({ Component: ChannelsPage })),
  },
  {
    path: ROUTES.agent,
    handle: { layout: PageLayout.Full } satisfies RouteHandle,
    lazy: () =>
      import('@/pages/CrossmartAgentPage').then(({ CrossmartAgentPage }) => ({
        Component: CrossmartAgentPage,
      })),
  },
  { path: ROUTES.channelMap, element: <Navigate to={ROUTES.agent} replace /> },
  ...[ROUTES.channelConnection, ROUTES.channelConnectionTab].map((path) => ({
    path,
    lazy: () =>
      import('@/pages/ChannelConnectionPage').then(({ ChannelConnectionPage }) => ({
        Component: ChannelConnectionPage,
      })),
  })),
  {
    path: ROUTES.activity,
    lazy: () =>
      import('@/pages/ActivityPage').then(({ ActivityPage }) => ({ Component: ActivityPage })),
  },
  {
    path: ROUTES.suggestions,
    lazy: () =>
      import('@/pages/SuggestionsPage').then(({ SuggestionsPage }) => ({
        Component: SuggestionsPage,
      })),
  },
  {
    path: ROUTES.members,
    lazy: () =>
      import('@/pages/MembersPage').then(({ MembersPage }) => ({ Component: MembersPage })),
  },
  {
    path: ROUTES.workspaceSettings,
    lazy: () =>
      import('@/pages/WorkspaceSettingsPage').then(({ WorkspaceSettingsPage }) => ({
        Component: WorkspaceSettingsPage,
      })),
  },
  {
    path: ROUTES.billing,
    lazy: () =>
      import('@/pages/BillingPage').then(({ BillingPage }) => ({ Component: BillingPage })),
  },
  {
    path: ROUTES.checkoutSuccess,
    lazy: () =>
      import('@/pages/CheckoutSuccessPage').then(({ CheckoutSuccessPage }) => ({
        Component: CheckoutSuccessPage,
      })),
  },
  {
    path: ROUTES.checkoutCanceled,
    lazy: () =>
      import('@/pages/CheckoutCanceledPage').then(({ CheckoutCanceledPage }) => ({
        Component: CheckoutCanceledPage,
      })),
  },
  { path: ROUTES.plan, element: <Navigate to={ROUTES.billing} replace /> },
  {
    path: ROUTES.roles,
    lazy: () => import('@/pages/RolesPage').then(({ RolesPage }) => ({ Component: RolesPage })),
  },
  {
    path: ROUTES.apiKeys,
    lazy: () =>
      import('@/pages/ApiKeysPage').then(({ ApiKeysPage }) => ({ Component: ApiKeysPage })),
  },
  {
    path: ROUTES.webhooks,
    lazy: () =>
      import('@/pages/WebhooksPage').then(({ WebhooksPage }) => ({ Component: WebhooksPage })),
  },
  {
    path: ROUTES.webhookEndpoint,
    lazy: () =>
      import('@/pages/WebhookEndpointPage').then(({ WebhookEndpointPage }) => ({
        Component: WebhookEndpointPage,
      })),
  },
  {
    path: ROUTES.agentConnections,
    lazy: () =>
      import('@/pages/AgentConnectionsPage').then(({ AgentConnectionsPage }) => ({
        Component: AgentConnectionsPage,
      })),
  },
  {
    path: ROUTES.askInsights,
    lazy: () =>
      import('@/pages/AskInsightsPage').then(({ AskInsightsPage }) => ({
        Component: AskInsightsPage,
      })),
  },
  {
    path: ROUTES.askConversation,
    lazy: () =>
      import('@/pages/AskConversationPage').then(({ AskConversationPage }) => ({
        Component: AskConversationPage,
      })),
  },
];

/** An AI agent's sign-in steps (ADR 0019): signed in, but outside the app's shell. */
const agentAuthorizationRoutes: RouteObject[] = [
  {
    path: ROUTES.agentWorkspace,
    lazy: () =>
      import('@/pages/AgentWorkspacePage').then(({ AgentWorkspacePage }) => ({
        Component: AgentWorkspacePage,
      })),
  },
  {
    path: ROUTES.agentConsent,
    lazy: () =>
      import('@/pages/AgentConsentPage').then(({ AgentConsentPage }) => ({
        Component: AgentConsentPage,
      })),
  },
];

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.signIn, element: <SignInPage /> },
          { path: ROUTES.signUp, element: <SignUpPage /> },
          { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
          { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
        ],
      },
      {
        path: ROUTES.acceptInvitation,
        lazy: () =>
          import('@/pages/AcceptInvitationPage').then(({ AcceptInvitationPage }) => ({
            Component: AcceptInvitationPage,
          })),
      },
      {
        path: ROUTES.claimSandbox,
        lazy: () =>
          import('@/pages/ClaimSandboxPage').then(({ ClaimSandboxPage }) => ({
            Component: ClaimSandboxPage,
          })),
      },
      {
        element: (
          <RequireSession>
            <Outlet />
          </RequireSession>
        ),
        children: agentAuthorizationRoutes,
      },
      {
        element: (
          <RequireSession>
            <AppShell />
          </RequireSession>
        ),
        children: appRoutes,
      },
    ],
  },
]);
