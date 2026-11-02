export const ROUTE_PARAMS = {
  productId: 'productId',
  jobId: 'jobId',
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
  activity: '/activity',
  imports: '/imports',
  importJob: `/imports/:${ROUTE_PARAMS.jobId}`,
  apiKeys: '/settings/api-keys',
  members: '/settings/members',
} as const;

export function toProductRoute(productId: string): string {
  return ROUTES.product.replace(`:${ROUTE_PARAMS.productId}`, productId);
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
} as const;

/** Filters of the activity page, kept in the URL so a filtered log can be shared. */
export const ACTIVITY_ROUTE_QUERY = {
  action: 'action',
  outcome: 'outcome',
} as const;

export function toProductsRoute(filter: { gap?: string } = {}): string {
  const query = new URLSearchParams();
  if (filter.gap) query.set(ROUTE_QUERY.gap, filter.gap);
  const search = query.toString();
  return search ? `${ROUTES.products}?${search}` : ROUTES.products;
}
