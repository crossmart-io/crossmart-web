import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ProductEditor } from '@/features/catalog/editor';

export function NewProductPage() {
  return (
    <Page name="Add product" parents={PAGE_PARENTS.products}>
      <WorkspaceGate>{(workspace) => <ProductEditor workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
