import type { PropsWithChildren } from 'react';
import { Wordmark } from '@/components/brand/Wordmark';

/** The frame of an agent's sign-in steps: the wordmark over one centered card. */
export function AgentAuthorizationShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Wordmark />
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
