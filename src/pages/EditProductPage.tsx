import { useParams } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { useParentsOrReturnTo } from '@/components/navigation/return-to';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { RecentActivityCard } from '@/features/activity';
import { AgentMapLink } from '@/features/agent-console';
import {
  MarkSoldButton,
  type Product,
  ProductStatusBadge,
  soldStateOfProduct,
  useProduct,
} from '@/features/catalog';
import { ProductEditor } from '@/features/catalog/editor';
import { ProductChannelsCard, PublishResultAlert, useProductStoreNames } from '@/features/listings';
import { WorkspacePermission } from '@/api/schema';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { hasPermission, type Workspace } from '@/features/workspaces';

const PRODUCT_PAGE_COPY: ResourcePageCopy = {
  name: 'Product',
  notFoundName: 'Product not found',
  notFound: 'This product does not exist or was deleted.',
  loadFailed: 'This product could not be loaded',
};

/** "Mark as sold", naming the stores it comes off; for members who may edit products. */
function ProductActions({ workspace, product }: { workspace: Workspace; product: Product }) {
  const storeNames = useProductStoreNames(workspace.id, product.id);
  if (!hasPermission(workspace, WorkspacePermission.products_edit)) return null;
  return (
    <MarkSoldButton
      workspaceId={workspace.id}
      productId={product.id}
      title={product.title}
      {...soldStateOfProduct(product, storeNames)}
    />
  );
}

function EditProduct({ workspace, productId }: { workspace: Workspace; productId: string }) {
  const query = useProduct(workspace.id, productId);
  const canEdit = hasPermission(workspace, WorkspacePermission.products_edit);
  const parents = useParentsOrReturnTo(PAGE_PARENTS.products);
  useScrollToSection(query.isSuccess);
  return (
    <ResourcePage query={query} copy={PRODUCT_PAGE_COPY} parents={parents}>
      {(product) => (
        <Page
          name={product.title}
          parents={parents}
          actions={<ProductActions workspace={workspace} product={product} />}
          title={
            <>
              {product.title}
              <ProductStatusBadge status={product.status} />
            </>
          }
        >
          <PublishResultAlert />
          {/* Remount on a different product so the form starts from its values. */}
          <ProductEditor
            key={product.id}
            workspace={workspace}
            product={product}
            readOnly={!canEdit}
            aside={<RecentActivityCard workspaceId={workspace.id} productId={product.id} />}
            channels={
              <ProductChannelsCard
                workspaceId={workspace.id}
                productId={product.id}
                catalogCurrency={workspace.currency}
                canEdit={canEdit}
                action={<AgentMapLink />}
              />
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
