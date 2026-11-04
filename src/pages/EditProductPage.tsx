import { useParams } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { RecentActivityCard } from '@/features/activity';
import { ProductStatusBadge, useProduct } from '@/features/catalog';
import { ProductEditor } from '@/features/catalog/editor';
import type { Workspace } from '@/features/workspaces';

const PRODUCT_PAGE_NAME = 'Product';

function EditProduct({ workspace, productId }: { workspace: Workspace; productId: string }) {
  const { data: product, isPending, error, refetch } = useProduct(workspace.id, productId);

  if (isNotFoundError(error)) {
    return (
      <Page name="Product not found" parents={PAGE_PARENTS.products}>
        <p className="text-muted-foreground">This product does not exist or was deleted.</p>
      </Page>
    );
  }
  if (error) {
    return (
      <Page name={PRODUCT_PAGE_NAME} parents={PAGE_PARENTS.products}>
        <ErrorState title="This product could not be loaded" error={error} onRetry={refetch} />
      </Page>
    );
  }
  if (isPending) return <ContentLoader />;

  return (
    <Page
      name={product.title}
      parents={PAGE_PARENTS.products}
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
        aside={<RecentActivityCard workspaceId={workspace.id} productId={product.id} />}
      />
    </Page>
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
