import type { SortOption } from '@/components/lists/sort-options';
import { ProductSort, SortDirection } from '@/api/schema';
export const PRODUCTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/products';
export const PRODUCT_ENDPOINT = '/api/v1/workspaces/{workspaceId}/products/{productId}';

export const SEARCH_DEBOUNCE_MS = 300;

export const UPLOAD_FILE_FIELD = 'file';
export const PRODUCT_IMAGES_ENDPOINT = '/api/v1/workspaces/{workspaceId}/media/product-images';
export const CATALOG_STATS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/catalog-stats';
export const PRODUCT_BULK_ACTIONS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/product-bulk-actions';
export const PRODUCT_VIEWS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/product-views';
export const PRODUCT_VIEW_ENDPOINT = '/api/v1/workspaces/{workspaceId}/product-views/{viewId}';

/** The image types the API accepts. It checks the file content again, not just the name. */
export const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export const IMAGE_FILE_ACCEPT = IMAGE_CONTENT_TYPES.join(',');
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
export const MAX_IMAGE_MEGABYTES = 20;
/** Mirrors the API limit, so a large file fails before it is uploaded. */
export const MAX_IMAGE_BYTES = MAX_IMAGE_MEGABYTES * BYTES_PER_MEGABYTE;

/** Toasts after product changes. */
export const PRODUCT_FEEDBACK = {
  created: 'Product created',
  saved: 'Product saved',
  deleted: 'Product deleted',
} as const;

/** Feedback while editing a product. */
export const EDITOR_FEEDBACK = {
  invalid: 'Some fields need attention before you can save.',
  newProduct: 'New product',
  unsaved: 'Unsaved changes',
  optionRemoved: 'Option removed. Its variants were merged.',
  undo: 'Undo',
  readOnlyTitle: 'View only',
  readOnly:
    'Your role can view products but not change them. Ask a workspace owner or admin for access.',
} as const;

/** The stores card of a product that is not saved yet. */
export const NEW_PRODUCT_CHANNELS_COPY = {
  title: 'Stores',
  saveFirst: 'Save the product first, then choose which stores to list it in.',
  noStores: 'Not listed in any store yet.',
  connect: 'Connect a store',
  connectReason: 'to publish it with content written for each marketplace.',
} as const;

/** The two views of the catalog, as tabs over the products list. */
export const PRODUCT_VIEW_TABS_COPY = {
  label: 'Product views',
  products: 'Products',
  stock: 'Stock',
} as const;

/** Mirrors the API's limits, so the form can say so before a round trip. */
export const MIN_PRICE_ADJUSTMENT_PERCENT = -90;
export const MAX_PRICE_ADJUSTMENT_PERCENT = 500;

export const VIEW_FEEDBACK = {
  saved: 'View saved',
  deleted: 'View deleted',
} as const;

/** Explains the variant cost field wherever it is edited. */
export const COST_HELP = 'What you pay per unit. Used for pricing floors; never shown to buyers.';

/** The products table's orders, by their URL value; the first is the default. */
export const PRODUCT_SORTS: readonly [SortOption<ProductSort>, ...SortOption<ProductSort>[]] = [
  { value: 'title-asc', label: 'Title A–Z', sort: ProductSort.title, direction: SortDirection.asc },
  {
    value: 'title-desc',
    label: 'Title Z–A',
    sort: ProductSort.title,
    direction: SortDirection.desc,
  },
  {
    value: 'updated-desc',
    label: 'Recently updated',
    sort: ProductSort.updatedAt,
    direction: SortDirection.desc,
  },
  {
    value: 'created-desc',
    label: 'Newest first',
    sort: ProductSort.createdAt,
    direction: SortDirection.desc,
  },
];
