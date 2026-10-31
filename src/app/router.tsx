import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/config/routes';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [{ path: ROUTES.home, element: <HomePage /> }],
  },
]);
