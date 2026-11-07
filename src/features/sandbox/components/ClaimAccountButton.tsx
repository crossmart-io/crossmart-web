import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useClaimAsOwner } from '../hooks/useSandboxClaim';

interface ClaimAccountButtonProps {
  workspaceId: string;
  onClaimed?: () => void;
}

/** Claims the sandbox as its signed-in owner. */
export function ClaimAccountButton({ workspaceId, onClaimed }: ClaimAccountButtonProps) {
  const claim = useClaimAsOwner();
  return (
    <div className="flex flex-col gap-3">
      <FormError error={claim.error} />
      <Button
        disabled={claim.isPending}
        onClick={() => claim.mutate(workspaceId, { onSuccess: onClaimed })}
      >
        {claim.isPending && <Spinner data-icon="inline-start" />}
        {claim.isPending ? 'Claiming…' : 'Claim this account'}
      </Button>
    </div>
  );
}
