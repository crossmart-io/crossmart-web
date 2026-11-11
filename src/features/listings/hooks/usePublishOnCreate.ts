import type { Workspace } from '@/features/workspaces';
// From its file, not the editor's entry, so the listings feature does not load the editor.
import { type AfterCreate, SaveIntent } from '@/features/catalog/editor/save-intent';
import { pageAfterPublish } from '../publish-on-create';
import { toPublishResultState } from '../publish-result-state';
import { usePublishStores } from './usePublishStores';

/**
 * "Save & publish" for a new product: the stores to tick, and, once the product is saved, adding
 * it to them and opening its page where anything a store still needs is shown.
 */
export function usePublishOnCreate(workspace: Workspace) {
  const stores = usePublishStores(workspace);
  const afterCreate: AfterCreate = async (product, intent) => {
    if (intent !== SaveIntent.Publish || !stores.publishes) return undefined;
    const result = await stores.publish(product.id);
    return {
      to: pageAfterPublish(product.id, result.added),
      state: result.failures.length > 0 ? toPublishResultState(result) : undefined,
    };
  };
  return { stores, afterCreate };
}
