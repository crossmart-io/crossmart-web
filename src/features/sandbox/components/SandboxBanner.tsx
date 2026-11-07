import { Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCurrentWorkspace } from '@/features/workspaces';
import { formatDate } from '@/lib/format';
import { ClaimAccountButton } from './ClaimAccountButton';

/**
 * Shown while the current workspace is a sandbox an AI agent opened: what waits for the claim,
 * when it is deleted, and the button that claims it.
 */
export function SandboxBanner() {
  const { workspace } = useCurrentWorkspace();
  if (!workspace?.sandbox) return null;

  return (
    <Alert className="mb-6">
      <Bot />
      <AlertTitle>Sandbox: claim this account</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>
          An AI agent opened this account for you. Claim it to connect stores, publish and invite
          people. Until then it is deleted on {formatDate(workspace.sandbox.claimExpiresAt)}.
        </span>
        <div>
          <ClaimAccountButton workspaceId={workspace.id} />
        </div>
      </AlertDescription>
    </Alert>
  );
}
