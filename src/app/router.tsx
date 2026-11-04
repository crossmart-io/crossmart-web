import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/config/routes';
import { AuthLayout, RequireSession } from '@/features/auth';
import { HomePage } from '@/pages/HomePage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';

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
    children: [{ path: ROUTES.home, element: <HomePage /> }],
  },
]);
