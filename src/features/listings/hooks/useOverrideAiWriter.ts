import { useFormContext } from 'react-hook-form';
import type { ContentDraft, ContentDraftCurrent } from '@/features/ai-writer';
import type { OverrideFormValues } from '../override-form';

type ContentValues = Pick<OverrideFormValues, 'title' | 'customDescription' | 'descriptionHtml'>;

const AS_EDIT = { shouldDirty: true, shouldValidate: true } as const;

/**
 * Reads a store's title and description overrides for AI and writes its drafts back. An empty
 * field follows the product, so it is left out and the API rewrites what the store shows.
 */
export function useOverrideAiWriter() {
  const { getValues, setValue } = useFormContext<OverrideFormValues>();
  const snapshot = (): ContentValues => ({
    title: getValues('title'),
    customDescription: getValues('customDescription'),
    descriptionHtml: getValues('descriptionHtml'),
  });
  const restore = (values: ContentValues) => {
    setValue('title', values.title, AS_EDIT);
    setValue('customDescription', values.customDescription, AS_EDIT);
    setValue('descriptionHtml', values.descriptionHtml, AS_EDIT);
  };
  return {
    getCurrent: (): ContentDraftCurrent => {
      const values = snapshot();
      return {
        title: values.title.trim() || undefined,
        descriptionHtml: values.customDescription ? values.descriptionHtml : undefined,
      };
    },
    apply: (draft: ContentDraft) => {
      const previous = snapshot();
      if (draft.title !== null) setValue('title', draft.title, AS_EDIT);
      if (draft.descriptionHtml !== null) {
        setValue('customDescription', true, AS_EDIT);
        setValue('descriptionHtml', draft.descriptionHtml, AS_EDIT);
      }
      return () => restore(previous);
    },
  };
}
