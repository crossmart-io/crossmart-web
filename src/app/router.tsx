import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/config/routes';
import { AuthLayout, RequireSession } from '@/features/auth';
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
    path: ROUTES.members,
    lazy: () =>
      import('@/pages/MembersPage').then(({ MembersPage }) => ({ Component: MembersPage })),
  },
  {
    path: ROUTES.apiKeys,
    lazy: () =>
      import('@/pages/ApiKeysPage').then(({ ApiKeysPage }) => ({ Component: ApiKeysPage })),
  },
];

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.signIn, element: <SignInPage /> },
      { path: ROUTES.signUp, element: <SignUpPage /> },
    ],
  },
  {
    element: (
      <RequireSession>
        <AppShell />
      </RequireSession>
    ),
    children: appRoutes,
  },
]);
