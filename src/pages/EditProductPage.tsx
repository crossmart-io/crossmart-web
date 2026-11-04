import { useParams } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTE_PARAMS, ROUTES } from '@/config/routes';
import { ProductStatusBadge, useProduct } from '@/features/catalog';
import { ProductEditor } from '@/features/catalog/editor';
import type { Workspace } from '@/features/workspaces';

const BACK_TO_PRODUCTS = { to: ROUTES.products, label: 'Products' };

function EditProduct({ workspace, productId }: { workspace: Workspace; productId: string }) {
  const { data: product, isPending, isError } = useProduct(workspace.id, productId);

  if (isError) {
    return (
      <>
        <PageHeader title="Product not found" back={BACK_TO_PRODUCTS} />
        <p className="text-muted-foreground">This product does not exist or was deleted.</p>
      </>
    );
  }
  if (isPending) return <PageLoader />;

  return (
    <>
      <PageHeader
        title={
          <>
            {product.title}
            <ProductStatusBadge status={product.status} />
          </>
        }
        back={BACK_TO_PRODUCTS}
      />
      {/* Remount on a different product so the form starts from its values. */}
      <ProductEditor key={product.id} workspace={workspace} product={product} />
    </>
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
