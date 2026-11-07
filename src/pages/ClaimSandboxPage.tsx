import { useSearchParams } from 'react-router';
import { Wordmark } from '@/components/brand/Wordmark';
import { ClaimSandboxCard, SANDBOX_CLAIM_TOKEN_QUERY } from '@/features/sandbox';

/** Open to everyone: the person an AI agent opened the account for has no password yet. */
export function ClaimSandboxPage() {
  const [searchParams] = useSearchParams();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Wordmark />
      <main className="w-full max-w-sm">
        <ClaimSandboxCard token={searchParams.get(SANDBOX_CLAIM_TOKEN_QUERY) ?? ''} />
      </main>
    </div>
  );
}
