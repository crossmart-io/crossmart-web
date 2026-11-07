import { PlatformAdminGate } from '@/components/feedback/PlatformAdminGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ASK_INSIGHTS_COPY, AskInsights } from '@/features/ask-insights';

export function AskInsightsPage() {
  return (
    <PlatformAdminGate>
      <Page
        name={ASK_INSIGHTS_COPY.pageName}
        parents={PAGE_PARENTS.platform}
        description={ASK_INSIGHTS_COPY.pageDescription}
      >
        <AskInsights />
      </Page>
    </PlatformAdminGate>
  );
}
