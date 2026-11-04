export const ACTIVITY_ENDPOINT = '/api/v1/workspaces/{workspaceId}/activity';
export const PRODUCT_ACTIVITY_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/products/{productId}/activity';

export const ACTIVITY_PAGE_SIZE = 25;
/** Events on the product page card; the activity page has the rest. */
export const RECENT_PRODUCT_ACTIVITY_LIMIT = 5;

/** The action filter's "no filter" choice. Not an action, so it never reaches the API. */
export const ALL_ACTIONS = 'all';
