import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader';
import { ROUTE_PARAMS, ROUTES } from '@/config/routes';
import { ProductOverview, ProductStatusBadge, useProduct, VariantsTable } from '@/features/catalog';
import { useCurrentWorkspace } from '@/features/workspaces';

export function ProductPage() {
  const productId = useParams()[ROUTE_PARAMS.productId] ?? '';
  const { workspace } = useCurrentWorkspace();
  const { data: product, isPending, isError } = useProduct(workspace?.id, productId);

  if (isError) {
    return <p className="text-muted-foreground">This product does not exist or was deleted.</p>;
  }
  if (isPending) return <PageLoader />;

  return (
    <section className="flex flex-col gap-6">
      <Link
        to={ROUTES.products}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Products
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{product.title}</h1>
        <ProductStatusBadge status={product.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          <h2 className="font-medium">Variants</h2>
          <VariantsTable product={product} currency={workspace?.currency ?? ''} />
        </div>
        <ProductOverview product={product} />
      </div>
    </section>
  );
}
