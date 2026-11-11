import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ImportJobHistory, ImportProductsDialog } from '@/features/imports';
import { useCurrentWorkspace } from '@/features/workspaces';

export function ImportsPage() {
  const { workspace } = useCurrentWorkspace();

  return (
    <Page
      name="Imports"
      parents={PAGE_PARENTS.products}
      actions={
        workspace && <ImportProductsDialog workspaceId={workspace.id} showHistoryLink={false} />
      }
    >
      <WorkspaceGate>{(current) => <ImportJobHistory workspaceId={current.id} />}</WorkspaceGate>
    </Page>
  );
}
