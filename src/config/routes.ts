export const ROUTE_PARAMS = {
  productId: 'productId',
  jobId: 'jobId',
  connectionId: 'connectionId',
  orderId: 'orderId',
  endpointId: 'endpointId',
  tab: 'tab',
} as const;

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  /** Where invitation emails link to, with the token in the query. */
  acceptInvitation: '/invitations/accept',
  /** Where sandbox claim emails link to (ADR 0019), with the token in the query. */
  claimSandbox: '/claim',
  products: '/products',
  newProduct: '/products/new',
  product: `/products/:${ROUTE_PARAMS.productId}`,
  inventory: '/inventory',
  channels: '/channels',
  /** The catalog and every store it feeds, as a graph. */
  channelMap: '/channel-map',
  channelConnection: `/channels/:${ROUTE_PARAMS.connectionId}`,
  channelConnectionTab: `/channels/:${ROUTE_PARAMS.connectionId}/:${ROUTE_PARAMS.tab}`,
  activity: '/activity',
  suggestions: '/suggestions',
  orders: '/orders',
  order: `/orders/:${ROUTE_PARAMS.orderId}`,
  imports: '/imports',
  importJob: `/imports/:${ROUTE_PARAMS.jobId}`,
  apiKeys: '/settings/api-keys',
  /** The backend's email about an endpoint it turned off links here. */
  webhooks: '/settings/webhooks',
  webhookEndpoint: `/settings/webhooks/:${ROUTE_PARAMS.endpointId}`,
  workspaceSettings: '/settings/workspace',
  /** The plan, its billing and usage. Checkout and the billing portal return here (ADR 0024). */
  billing: '/settings/billing',
  /** Where checkout returns after paying, and after backing out; the API names these paths. */
  checkoutSuccess: '/settings/billing/checkout/success',
  checkoutCanceled: '/settings/billing/checkout/canceled',
  /** The former plan page; kept so old links land on billing. */
  plan: '/settings/plan',
  members: '/settings/members',
  roles: '/settings/roles',
  account: '/settings/account',
  agentConnections: '/settings/agents',
  /** Steps of an AI agent's sign-in (ADR 0019): Better Auth sends the browser here. */
  agentWorkspace: '/oauth/workspace',
  agentConsent: '/oauth/consent',
} as const;

export function toProductRoute(productId: string): string {
  return ROUTES.product.replace(`:${ROUTE_PARAMS.productId}`, productId);
}

/** A channel connection's page, opened on `tab` when one is given. */
export function toChannelConnectionRoute(connectionId: string, tab?: string): string {
  const route = ROUTES.channelConnection.replace(`:${ROUTE_PARAMS.connectionId}`, connectionId);
  return tab ? `${route}/${tab}` : route;
}

/** A webhook endpoint's page, with its delivery log. */
export function toWebhookEndpointRoute(endpointId: string): string {
  return ROUTES.webhookEndpoint.replace(`:${ROUTE_PARAMS.endpointId}`, endpointId);
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
  /** On a product's page: the store whose listing editor opens at once. */
  overrideStore: 'override',
  /** On a store's page: the product whose listing editor opens over the listings. */
  listingProduct: 'listing',
} as const;

/** Parts of a page a link can scroll to, as the ids of their cards (`#media`). */
export enum PageSection {
  ProductMedia = 'media',
  ProductStatus = 'status',
  ProductVariants = 'variants',
  ProductChannelMap = 'channel-map',
  StoreListingDefaults = 'listing-defaults',
  StoreListingSetup = 'listing-setup',
  StorePricing = 'pricing',
}

/** `route`, scrolled to one of its sections. */
export function withSection(route: string, section: PageSection): string {
  return `${route}#${section}`;
}

/** A product's page with its listing editor for one store open, to fix what the store needs. */
export function toProductStoreOverrideRoute(productId: string, connectionId: string): string {
  const query = new URLSearchParams({ [ROUTE_QUERY.overrideStore]: connectionId });
  return `${toProductRoute(productId)}?${query}`;
}

/** A store's listings with the listing editor open on one product, so it can be shared. */
export function toStoreListingRoute(connectionId: string, productId: string): string {
  const query = new URLSearchParams({ [ROUTE_QUERY.listingProduct]: productId });
  return `${toChannelConnectionRoute(connectionId)}?${query}`;
}

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
