export const ROUTE_PARAMS = {
  productId: 'productId',
  jobId: 'jobId',
  connectionId: 'connectionId',
  orderId: 'orderId',
  tab: 'tab',
} as const;

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  products: '/products',
  newProduct: '/products/new',
  product: `/products/:${ROUTE_PARAMS.productId}`,
  inventory: '/inventory',
  channels: '/channels',
  channelConnection: `/channels/:${ROUTE_PARAMS.connectionId}`,
  channelConnectionTab: `/channels/:${ROUTE_PARAMS.connectionId}/:${ROUTE_PARAMS.tab}`,
  activity: '/activity',
  orders: '/orders',
  order: `/orders/:${ROUTE_PARAMS.orderId}`,
  imports: '/imports',
  importJob: `/imports/:${ROUTE_PARAMS.jobId}`,
  apiKeys: '/settings/api-keys',
  members: '/settings/members',
  account: '/settings/account',
} as const;

export function toProductRoute(productId: string): string {
  return ROUTES.product.replace(`:${ROUTE_PARAMS.productId}`, productId);
}

/** A channel connection's page, opened on `tab` when one is given. */
export function toChannelConnectionRoute(connectionId: string, tab?: string): string {
  const route = ROUTES.channelConnection.replace(`:${ROUTE_PARAMS.connectionId}`, connectionId);
  return tab ? `${route}/${tab}` : route;
}

export function toImportJobRoute(jobId: string): string {
  return ROUTES.importJob.replace(`:${ROUTE_PARAMS.jobId}`, jobId);
}

/** Query parameters that pages read from the URL, so filtered views can be linked to. */
export const ROUTE_QUERY = {
  gap: 'gap',
  search: 'q',
  status: 'status',
  stockLevel: 'stock',
  state: 'state',
  sort: 'sort',
  storeFilter: 'stores',
  storeId: 'store',
} as const;

/** A table's page and rows per page, kept in the URL with its filters. */
export const PAGINATION_QUERY = {
  page: 'page',
  pageSize: 'per',
} as const;

/** Filters of the activity page, kept in the URL so a filtered log can be shared. */
export const ACTIVITY_ROUTE_QUERY = {
  action: 'action',
  outcome: 'outcome',
  sort: 'sort',
} as const;

export function toProductsRoute(
  filter: { gap?: string; storeFilter?: string; storeId?: string } = {},
): string {
  const query = new URLSearchParams();
  if (filter.gap) query.set(ROUTE_QUERY.gap, filter.gap);
  if (filter.storeFilter) query.set(ROUTE_QUERY.storeFilter, filter.storeFilter);
  if (filter.storeId) query.set(ROUTE_QUERY.storeId, filter.storeId);
  const search = query.toString();
  return search ? `${ROUTES.products}?${search}` : ROUTES.products;
}

/** The inventory list, optionally at one stock level (`StockLevel`). */
export function toInventoryRoute(stockLevel?: string): string {
  return stockLevel
    ? `${ROUTES.inventory}?${new URLSearchParams({ [ROUTE_QUERY.stockLevel]: stockLevel })}`
    : ROUTES.inventory;
}

export function toOrderRoute(orderId: string): string {
  return ROUTES.order.replace(`:${ROUTE_PARAMS.orderId}`, orderId);
}
