import { Outlet } from 'react-router';
import { Wordmark } from '@/components/brand/Wordmark';
import { AuthBrandPanel } from './AuthBrandPanel';
import { RedirectIfSignedIn } from './RedirectIfSignedIn';

/** Sign-in and sign-up: the form, with the brand beside it on wide screens. */
export function AuthLayout() {
  return (
    <RedirectIfSignedIn>
      <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <AuthBrandPanel />
        <div className="flex flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
          <div className="lg:hidden">
            <Wordmark />
          </div>
          <main className="w-full max-w-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </RedirectIfSignedIn>
  );
}
