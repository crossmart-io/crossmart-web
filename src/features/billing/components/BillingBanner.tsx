import { CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { useNow } from '@/hooks/useNow';
import { BannerTone, billingBanner } from '../billing-banner';
import { useBillingAccess } from '../hooks/useBillingAccess';

/**
 * Shown above every page while billing needs attention: a trial running out, a failed payment,
 * or an account that is read-only. Billing admins get a link to fix it.
 */
export function BillingBanner() {
  const { workspace } = useCurrentWorkspace();
  const { data: access } = useBillingAccess(workspace?.id);
  const now = useNow();
  if (!workspace || !access) return null;
  const canManage = hasPermission(workspace, WorkspacePermission.billing_manage);
  const banner = billingBanner(access, canManage, now);
  if (!banner) return null;

  return (
    <Alert className="mb-6" variant={banner.tone === BannerTone.Danger ? 'destructive' : 'default'}>
      <CreditCard />
      <AlertTitle>{banner.title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{banner.body}</span>
        {banner.action && (
          <div>
            <Button size="sm" variant="outline" asChild>
              <Link to={ROUTES.billing}>{banner.action}</Link>
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
