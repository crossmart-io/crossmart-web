import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ProductEditor } from '@/features/catalog/editor';
import { PublishStoresCard, usePublishOnCreate } from '@/features/listings';
import type { Workspace } from '@/features/workspaces';

/** A new product with its stores ticked, published in one click. */
function NewProduct({ workspace }: { workspace: Workspace }) {
  const { stores, afterCreate } = usePublishOnCreate(workspace);
  return (
    <ProductEditor
      workspace={workspace}
      channels={<PublishStoresCard state={stores} />}
      afterCreate={afterCreate}
      publishes={stores.publishes}
    />
  );
}

export function NewProductPage() {
  return (
    <Page name="Add product" parents={PAGE_PARENTS.products}>
      <WorkspaceGate>{(workspace) => <NewProduct workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
