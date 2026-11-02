import { Outlet } from 'react-router';
import { Wordmark } from '@/components/brand/Wordmark';
import { RedirectIfSignedIn } from './RedirectIfSignedIn';

/** Centred layout for the signed-out screens. */
export function AuthLayout() {
  return (
    <RedirectIfSignedIn>
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
        <Wordmark />
        <main className="w-full max-w-sm">
          <Outlet />
        </main>
      </div>
    </RedirectIfSignedIn>
  );
}
