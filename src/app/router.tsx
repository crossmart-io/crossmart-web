import { createBrowserRouter, Outlet, type RouteObject } from 'react-router';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout, type RouteHandle } from '@/components/layout/page-layout';
import { ROUTES } from '@/config/routes';
import { AuthLayout, RequireSession } from '@/features/auth';
import { SettingsIndexRedirect, SettingsLayout } from '@/features/settings';
import { legacyRoutes } from './legacy-routes';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';

/** A page that loads on first visit, so the sign-in screen stays small. */
type LazyPage = NonNullable<RouteObject['lazy']>;

/** Settings' tabs, inside its one page (`SettingsLayout`). */
const settingsRoutes: RouteObject[] = [
  { index: true, element: <SettingsIndexRedirect /> },
  {
    path: ROUTES.generalSettings,
    lazy: () =>
      import('@/pages/GeneralSettingsPage').then(({ GeneralSettingsPage }) => ({
        Component: GeneralSettingsPage,
      })),
  },
  {
    path: ROUTES.team,
    lazy: () => import('@/pages/TeamPage').then(({ TeamPage }) => ({ Component: TeamPage })),
  },
  {
    path: ROUTES.roles,
    lazy: () => import('@/pages/RolesPage').then(({ RolesPage }) => ({ Component: RolesPage })),
  },
  {
    path: ROUTES.billing,
    lazy: () =>
      import('@/pages/BillingPage').then(({ BillingPage }) => ({ Component: BillingPage })),
  },
  {
    path: ROUTES.developers,
    lazy: () =>
      import('@/pages/DevelopersPage').then(({ DevelopersPage }) => ({
        Component: DevelopersPage,
      })),
  },
];

const PAGES: Record<string, LazyPage> = {
  [ROUTES.home]: () =>
    import('@/pages/OverviewPage').then(({ OverviewPage }) => ({ Component: OverviewPage })),
  [ROUTES.products]: () =>
    import('@/pages/ProductsPage').then(({ ProductsPage }) => ({ Component: ProductsPage })),
  [ROUTES.newProduct]: () =>
    import('@/pages/NewProductPage').then(({ NewProductPage }) => ({ Component: NewProductPage })),
  [ROUTES.stock]: () =>
    import('@/pages/StockPage').then(({ StockPage }) => ({ Component: StockPage })),
  [ROUTES.product]: () =>
    import('@/pages/EditProductPage').then(({ EditProductPage }) => ({
      Component: EditProductPage,
    })),
  [ROUTES.orders]: () =>
    import('@/pages/OrdersPage').then(({ OrdersPage }) => ({ Component: OrdersPage })),
  [ROUTES.order]: () =>
    import('@/pages/OrderPage').then(({ OrderPage }) => ({ Component: OrderPage })),
  [ROUTES.account]: () =>
    import('@/pages/AccountPage').then(({ AccountPage }) => ({ Component: AccountPage })),
  [ROUTES.imports]: () =>
    import('@/pages/ImportsPage').then(({ ImportsPage }) => ({ Component: ImportsPage })),
  [ROUTES.importJob]: () =>
    import('@/pages/ImportJobPage').then(({ ImportJobPage }) => ({ Component: ImportJobPage })),
  [ROUTES.stores]: () =>
    import('@/pages/StoresPage').then(({ StoresPage }) => ({ Component: StoresPage })),
  [ROUTES.store]: () =>
    import('@/pages/StorePage').then(({ StorePage }) => ({ Component: StorePage })),
  [ROUTES.storeTab]: () =>
    import('@/pages/StorePage').then(({ StorePage }) => ({ Component: StorePage })),
  [ROUTES.agentReview]: () =>
    import('@/pages/AgentReviewPage').then(({ AgentReviewPage }) => ({
      Component: AgentReviewPage,
    })),
  [ROUTES.activity]: () =>
    import('@/pages/ActivityPage').then(({ ActivityPage }) => ({ Component: ActivityPage })),
  [ROUTES.checkoutSuccess]: () =>
    import('@/pages/CheckoutSuccessPage').then(({ CheckoutSuccessPage }) => ({
      Component: CheckoutSuccessPage,
    })),
  [ROUTES.checkoutCanceled]: () =>
    import('@/pages/CheckoutCanceledPage').then(({ CheckoutCanceledPage }) => ({
      Component: CheckoutCanceledPage,
    })),
  [ROUTES.webhookEndpoint]: () =>
    import('@/pages/WebhookEndpointPage').then(({ WebhookEndpointPage }) => ({
      Component: WebhookEndpointPage,
    })),
  [ROUTES.askInsights]: () =>
    import('@/pages/AskInsightsPage').then(({ AskInsightsPage }) => ({
      Component: AskInsightsPage,
    })),
  [ROUTES.askConversation]: () =>
    import('@/pages/AskConversationPage').then(({ AskConversationPage }) => ({
      Component: AskConversationPage,
    })),
};

const appRoutes: RouteObject[] = [
  ...Object.entries(PAGES).map(([path, lazy]) => ({ path, lazy })),
  {
    path: ROUTES.agent,
    handle: { layout: PageLayout.Full } satisfies RouteHandle,
    lazy: () =>
      import('@/pages/CrossmartAgentPage').then(({ CrossmartAgentPage }) => ({
        Component: CrossmartAgentPage,
      })),
  },
  { path: ROUTES.settings, element: <SettingsLayout />, children: settingsRoutes },
  ...legacyRoutes,
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
