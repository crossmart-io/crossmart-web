import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toProductRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import { toSharePercent } from '../sales-format';
import { RankedBar } from './RankedBar';
import type { SalesReport } from '../sales.types';

/** The products that sold the most this period, by line sales. */
export function TopProductsCard({ report }: { report: SalesReport }) {
  const top = Number(report.topProducts[0]?.sales ?? 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top products</CardTitle>
        <CardDescription>By sales of their order lines, before discounts and tax.</CardDescription>
      </CardHeader>
      <CardContent>
        {report.topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No catalog products sold this period.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {report.topProducts.map((product) => (
              <li key={product.productId} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <Link
                    to={toProductRoute(product.productId)}
                    className="truncate font-medium hover:underline"
                  >
                    {product.title}
                  </Link>
                  <span className="shrink-0 tabular-nums">
                    {formatMoney(product.sales, report.currencyCode)}
                  </span>
                </div>
                <RankedBar share={toSharePercent(Number(product.sales), top)} />
                <p className="text-xs text-muted-foreground">{pluralize(product.units, 'unit')}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
