import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ImportJobHistory, ImportProductsDialog } from '@/features/imports';
import { useCurrentWorkspace } from '@/features/workspaces';

export function ImportsPage() {
  const { workspace } = useCurrentWorkspace();

  return (
    <Page
      name="Imports"
      description="Every file and store imported into this workspace, and the records that need a fix."
      actions={workspace && <ImportProductsDialog workspaceId={workspace.id} />}
    >
      <WorkspaceGate>{(current) => <ImportJobHistory workspaceId={current.id} />}</WorkspaceGate>
    </Page>
  );
}
