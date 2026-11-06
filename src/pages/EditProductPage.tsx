import { useParams } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { useParentsOrReturnTo } from '@/components/navigation/return-to';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { RecentActivityCard } from '@/features/activity';
import { ProductStatusBadge, useProduct } from '@/features/catalog';
import { ProductEditor } from '@/features/catalog/editor';
import { ProductChannelsCard } from '@/features/listings';
import { WorkspacePermission } from '@/api/schema';
import { hasPermission, type Workspace } from '@/features/workspaces';

const PRODUCT_PAGE_COPY: ResourcePageCopy = {
  name: 'Product',
  notFoundName: 'Product not found',
  notFound: 'This product does not exist or was deleted.',
  loadFailed: 'This product could not be loaded',
};

function EditProduct({ workspace, productId }: { workspace: Workspace; productId: string }) {
  const query = useProduct(workspace.id, productId);
  const canEdit = hasPermission(workspace, WorkspacePermission.products_edit);
  const parents = useParentsOrReturnTo(PAGE_PARENTS.products);
  return (
    <ResourcePage query={query} copy={PRODUCT_PAGE_COPY} parents={parents}>
      {(product) => (
        <Page
          name={product.title}
          parents={parents}
          title={
            <>
              {product.title}
              <ProductStatusBadge status={product.status} />
            </>
          }
        >
          {/* Remount on a different product so the form starts from its values. */}
          <ProductEditor
            key={product.id}
            workspace={workspace}
            product={product}
            readOnly={!canEdit}
            aside={<RecentActivityCard workspaceId={workspace.id} productId={product.id} />}
            channels={
              <ProductChannelsCard workspaceId={workspace.id} product={product} canEdit={canEdit} />
            }
          />
        </Page>
      )}
    </ResourcePage>
  );
}

export function EditProductPage() {
  const productId = useParams()[ROUTE_PARAMS.productId] ?? '';
  return (
    <WorkspaceGate>
      {(workspace) => <EditProduct workspace={workspace} productId={productId} />}
    </WorkspaceGate>
  );
}
