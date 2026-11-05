import type { components } from '@/api/schema';

type CreateContentDraft = components['schemas']['CreateContentDraftDto'];

export type ContentDraft = components['schemas']['ContentDraftDto'];

/** Where the text will appear: the catalog when there is no store. */
export type ContentDraftTarget = { workspaceId: string } & Pick<
  CreateContentDraft,
  'productId' | 'connectionId'
>;

/** The fields as they are in the form now, unsaved edits included. */
export type ContentDraftCurrent = Pick<CreateContentDraft, 'title' | 'descriptionHtml'>;
