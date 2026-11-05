import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { SuggestionsInbox } from '@/features/suggestions';

export function SuggestionsPage() {
  return (
    <Page
      name="Suggestions"
      description="Changes AI proposes for your listings. Nothing changes in a store until you approve it."
    >
      <WorkspaceGate>{(workspace) => <SuggestionsInbox workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
