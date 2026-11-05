import type { components } from '@/api/schema';

export type ContentDraft = components['schemas']['ContentDraftDto'];

/** Where the text will appear: the catalog when there is no store. */
export interface ContentDraftTarget {
  workspaceId: string;
  productId: string;
  connectionId?: string;
}

/** The fields as they are in the form now, unsaved edits included. */
export interface ContentDraftCurrent {
  title?: string;
  descriptionHtml?: string;
}
