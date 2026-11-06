import { ChevronRight, CircleCheck, CircleDashed, PackageOpen, Plus, Upload } from 'lucide-react';
import { Link } from 'react-router';
import { CatalogGap } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES, toProductsRoute } from '@/config/routes';
import { CATALOG_GAP_COPY, useCatalogStats } from '@/features/catalog';
import { pluralize } from '@/lib/format';
import { CATALOG_HEALTH_EMPTY_COPY } from '../overview.constants';

/** What channels ask for before they accept a listing. Out of stock has its own tile. */
const HEALTH_GAPS: readonly CatalogGap[] = [
  CatalogGap.images,
  CatalogGap.description,
  CatalogGap.sku,
  CatalogGap.barcode,
];

const SKELETON_ROWS = HEALTH_GAPS.length;

export function CatalogHealth({ workspaceId }: { workspaceId: string }) {
  const { data: stats } = useCatalogStats(workspaceId);
  const counts = new Map(stats?.gaps.map((entry) => [entry.gap, entry.products]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalog health</CardTitle>
        <CardDescription>What marketplaces ask for before they accept a listing.</CardDescription>
      </CardHeader>
      <CardContent>
        {!stats && <HealthSkeleton />}
        {stats?.products === 0 && <CatalogHealthEmpty />}
        {stats && stats.products > 0 && (
          <ul className="-mx-2 flex flex-col">
            {HEALTH_GAPS.map((gap) => (
              <HealthRow key={gap} gap={gap} products={counts.get(gap) ?? 0} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function HealthSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  );
}

/** An empty catalog has nothing to check, so it asks for products instead of showing passes. */
function CatalogHealthEmpty() {
  return (
    <Empty className="p-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpen />
        </EmptyMedia>
        <EmptyTitle>{CATALOG_HEALTH_EMPTY_COPY.title}</EmptyTitle>
        <EmptyDescription>{CATALOG_HEALTH_EMPTY_COPY.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button asChild>
          <Link to={ROUTES.newProduct}>
            <Plus data-icon="inline-start" />
            {CATALOG_HEALTH_EMPTY_COPY.addProduct}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={ROUTES.imports}>
            <Upload data-icon="inline-start" />
            {CATALOG_HEALTH_EMPTY_COPY.importProducts}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function HealthRow({ gap, products }: { gap: CatalogGap; products: number }) {
  const copy = CATALOG_GAP_COPY[gap];
  if (products === 0) {
    return (
      <li className="flex items-center gap-3 px-2 py-2 text-sm text-muted-foreground">
        <CircleCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
        <span>
          <span className="sr-only">Done: </span>
          No products {copy.health}
        </span>
      </li>
    );
  }
  return (
    <li>
      <Link
        to={toProductsRoute({ gap })}
        className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <CircleDashed className="size-4 shrink-0 text-warning" aria-hidden="true" />
        <span className="flex-1">
          <span className="font-medium tabular-nums">{pluralize(products, 'product')}</span>{' '}
          {copy.health}
        </span>
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  );
}
