import { PageHeader } from '@/components/layout/PageHeader';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { ROUTES } from '@/config/routes';
import { ProductEditor } from '@/features/catalog/editor';

export function NewProductPage() {
  return (
    <>
      <PageHeader title="Add product" back={{ to: ROUTES.products, label: 'Products' }} />
      <WorkspaceGate>{(workspace) => <ProductEditor workspace={workspace} />}</WorkspaceGate>
    </>
  );
}
