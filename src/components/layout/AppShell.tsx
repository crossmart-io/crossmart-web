import { Outlet } from 'react-router';
import { AppHeader } from './AppHeader';

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
