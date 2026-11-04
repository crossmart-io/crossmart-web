export const PRODUCTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/products';
export const PRODUCT_ENDPOINT = '/api/v1/workspaces/{workspaceId}/products/{productId}';
export const PRODUCT_IMPORTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/product-imports';

export const PRODUCTS_PAGE_SIZE = 25;
export const SEARCH_DEBOUNCE_MS = 300;

/** Shopify exports are plain CSV; some systems label them as Excel. */
export const CSV_FILE_ACCEPT = '.csv,text/csv';
/** Field names of the multipart import form. */
export const IMPORT_FORM_FIELDS = { format: 'format', file: 'file' } as const;
export const UPLOAD_FILE_FIELD = 'file';
export const PRODUCT_IMAGES_ENDPOINT = '/api/v1/workspaces/{workspaceId}/media/product-images';
export const CATALOG_STATS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/catalog-stats';

/** Image types the API accepts; the API checks the bytes again. */
export const IMAGE_FILE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
