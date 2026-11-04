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
