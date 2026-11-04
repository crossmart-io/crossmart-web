export const ROUTE_PARAMS = {
  productId: 'productId',
} as const;

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  products: '/products',
  newProduct: '/products/new',
  product: `/products/:${ROUTE_PARAMS.productId}`,
  channels: '/channels',
  apiKeys: '/settings/api-keys',
  members: '/settings/members',
} as const;

export function toProductRoute(productId: string): string {
  return ROUTES.product.replace(`:${ROUTE_PARAMS.productId}`, productId);
}

/** Query parameters that pages read from the URL, so filtered views can be linked to. */
export const ROUTE_QUERY = {
  gap: 'gap',
} as const;

export function toProductsRoute(filter: { gap?: string } = {}): string {
  const query = new URLSearchParams();
  if (filter.gap) query.set(ROUTE_QUERY.gap, filter.gap);
  const search = query.toString();
  return search ? `${ROUTES.products}?${search}` : ROUTES.products;
}
