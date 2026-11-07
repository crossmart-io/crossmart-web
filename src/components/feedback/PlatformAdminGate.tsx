import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useMe } from '@/features/workspaces';
import { ContentLoader } from './ContentLoader';
import { ErrorState } from './ErrorState';
import { PLATFORM_ADMIN_GATE_COPY } from './platform-admin-gate.constants';

/** What everyone else sees: the same as an address that does not exist, so nothing is revealed. */
function PlatformPageNotFound() {
  return (
    <Page name={PLATFORM_ADMIN_GATE_COPY.notFoundName}>
      <p className="text-muted-foreground">{PLATFORM_ADMIN_GATE_COPY.notFound}</p>
      <div>
        <Button asChild variant="outline">
          <Link to={ROUTES.home}>{PLATFORM_ADMIN_GATE_COPY.backHome}</Link>
        </Button>
      </div>
    </Page>
  );
}

/**
 * Renders its pages only for the people who run this Crossmart instance (`me.platformAdmin`).
 * The API answers 404 to everyone else, and so does this gate.
 */
export function PlatformAdminGate({ children }: { children: ReactNode }) {
  const me = useMe();
  if (me.isError) {
    return (
      <ErrorState
        title={PLATFORM_ADMIN_GATE_COPY.loadFailed}
        error={me.error}
        onRetry={me.refetch}
      />
    );
  }
  if (me.isPending) return <ContentLoader />;
  return me.data.platformAdmin ? children : <PlatformPageNotFound />;
}
