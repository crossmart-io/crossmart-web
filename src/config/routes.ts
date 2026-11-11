export const ROUTE_PARAMS = {
  productId: 'productId',
  jobId: 'jobId',
  connectionId: 'connectionId',
  orderId: 'orderId',
  endpointId: 'endpointId',
  conversationId: 'conversationId',
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
  /** The stock of every variant, a view of the products list. */
  stock: '/products/stock',
  product: `/products/:${ROUTE_PARAMS.productId}`,
  /** The connected stores (channel connections), and the channels a store can be added on. */
  stores: '/stores',
  store: `/stores/:${ROUTE_PARAMS.connectionId}`,
  storeTab: `/stores/:${ROUTE_PARAMS.connectionId}/:${ROUTE_PARAMS.tab}`,
  /** Crossmart Agent: the chat, the live map of the catalog and its stores, and the event stream. */
  agent: '/agent',
  /** AI suggestions and outside agents' proposals (ADR 0028) waiting for review; the bell links here. */
  agentReview: '/agent/review',
  activity: '/activity',
  orders: '/orders',
  order: `/orders/:${ROUTE_PARAMS.orderId}`,
  imports: '/imports',
  importJob: `/imports/:${ROUTE_PARAMS.jobId}`,
  /** Settings is one page with a tab per route below it. */
  settings: '/settings',
  generalSettings: '/settings/general',
  team: '/settings/team',
  roles: '/settings/team/roles',
  /** The plan, its billing and usage. Checkout and the billing portal return here (ADR 0024). */
  billing: '/settings/billing',
  /** Where checkout returns after paying, and after backing out; the API names these paths. */
  checkoutSuccess: '/settings/billing/checkout/success',
  checkoutCanceled: '/settings/billing/checkout/canceled',
  /** API keys, webhooks and connected agents. */
  developers: '/settings/developers',
  webhookEndpoint: `/settings/developers/webhooks/:${ROUTE_PARAMS.endpointId}`,
  /** The signed-in person's own account, from the user menu. */
  account: '/account',
  /** Steps of an AI agent's sign-in (ADR 0019): Better Auth sends the browser here. */
  agentWorkspace: '/oauth/workspace',
  agentConsent: '/oauth/consent',
  /** Ask Crossmart's conversations and escalations, for platform admins only. */
  askInsights: '/admin/ask',
  /** The backend's escalation emails link here, with the conversation's id. */
  askConversation: `/admin/ask/:${ROUTE_PARAMS.conversationId}`,
} as const;

/**
 * Paths the app used before, kept so bookmarks, emails and OAuth returns still land: each one
 * redirects to its page in `ROUTES`, with its query and hash.
 */
export const LEGACY_ROUTES = {
  /** The API's OAuth callback still sends the browser here after a store connects. */
  channels: '/channels',
  channelConnection: `/channels/:${ROUTE_PARAMS.connectionId}`,
  channelConnectionTab: `/channels/:${ROUTE_PARAMS.connectionId}/:${ROUTE_PARAMS.tab}`,
  channelMap: '/channel-map',
  inventory: '/inventory',
  suggestions: '/suggestions',
  agentProposals: '/agent-proposals',
  workspaceSettings: '/settings/workspace',
  members: '/settings/members',
  roles: '/settings/roles',
  apiKeys: '/settings/api-keys',
  /** The backend's email about an endpoint it turned off links here. */
  webhooks: '/settings/webhooks',
  webhookEndpoint: `/settings/webhooks/:${ROUTE_PARAMS.endpointId}`,
  agentConnections: '/settings/agents',
  account: '/settings/account',
  plan: '/settings/plan',
} as const;

export function toProductRoute(productId: string): string {
  return ROUTES.product.replace(`:${ROUTE_PARAMS.productId}`, productId);
}

/** A store's (channel connection's) page, opened on `tab` when one is given. */
export function toStoreRoute(connectionId: string, tab?: string): string {
  const route = ROUTES.store.replace(`:${ROUTE_PARAMS.connectionId}`, connectionId);
  return tab ? `${route}/${tab}` : route;
}

/** A webhook endpoint's page, with its delivery log. */
export function toWebhookEndpointRoute(endpointId: string): string {
  return ROUTES.webhookEndpoint.replace(`:${ROUTE_PARAMS.endpointId}`, endpointId);
}

/** One Ask Crossmart conversation, with its answers and escalations. */
export function toAskConversationRoute(conversationId: string): string {
  return ROUTES.askConversation.replace(`:${ROUTE_PARAMS.conversationId}`, conversationId);
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
  /** On the review list: `ReviewSource`. */
  reviewSource: 'source',
  /** On Crossmart Agent: the panel a narrow screen opens on. */
  agentPanel: 'panel',
} as const;

/** Parts of a page a link can scroll to, as the ids of their cards (`#media`). */
export enum PageSection {
  ProductMedia = 'media',
  ProductStatus = 'status',
  ProductVariants = 'variants',
  ApiKeys = 'api-keys',
  Webhooks = 'webhooks',
  ConnectedAgents = 'agents',
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
  return `${toStoreRoute(connectionId)}?${query}`;
}

/** A table's page and rows per page, kept in the URL with its filters. */
export const PAGINATION_QUERY = {
  page: 'page',
  pageSize: 'per',
} as const;

/** The Ask insights page's tab and filters, kept in the URL so a filtered view can be shared. */
export const ASK_INSIGHTS_ROUTE_QUERY = {
  view: 'view',
  outcome: 'outcome',
  channel: 'channel',
  escalated: 'escalated',
  from: 'from',
  to: 'to',
  status: 'status',
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

/** The stock list, optionally at one stock level (`StockLevel`). */
export function toStockRoute(stockLevel?: string): string {
  return stockLevel
    ? `${ROUTES.stock}?${new URLSearchParams({ [ROUTE_QUERY.stockLevel]: stockLevel })}`
    : ROUTES.stock;
}

/** Where review items come from: AI suggestions, or outside agents' proposals (ADR 0028). */
export enum ReviewSource {
  Suggestions = 'ai',
  Proposals = 'agents',
}

/** The review list, on one source when one is given. */
export function toAgentReviewRoute(source?: ReviewSource): string {
  return source
    ? `${ROUTES.agentReview}?${new URLSearchParams({ [ROUTE_QUERY.reviewSource]: source })}`
    : ROUTES.agentReview;
}

/** Crossmart Agent, opened on one of its panels (on narrow screens, where they are tabs). */
export function toAgentRoute(panel?: string): string {
  return panel
    ? `${ROUTES.agent}?${new URLSearchParams({ [ROUTE_QUERY.agentPanel]: panel })}`
    : ROUTES.agent;
}

export function toOrderRoute(orderId: string): string {
  return ROUTES.order.replace(`:${ROUTE_PARAMS.orderId}`, orderId);
}
