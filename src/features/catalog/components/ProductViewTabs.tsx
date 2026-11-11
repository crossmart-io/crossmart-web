import { RouteTabs, type RouteTab } from '@/components/navigation/RouteTabs';
import { ROUTES } from '@/config/routes';
import { PRODUCT_VIEW_TABS_COPY as COPY } from '../catalog.constants';

const TABS: readonly RouteTab[] = [
  { label: COPY.products, to: ROUTES.products, exact: true },
  { label: COPY.stock, to: ROUTES.stock },
];

/** The products list, or the stock of every variant: two views of the same catalog. */
export function ProductViewTabs() {
  return <RouteTabs tabs={TABS} label={COPY.label} />;
}
