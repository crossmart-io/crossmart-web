import { useFormContext } from 'react-hook-form';
import type { ContentDraft, ContentDraftCurrent } from '@/features/ai-writer';
import type { ProductFormValues } from './product-form.schema';

const AS_EDIT = { shouldDirty: true, shouldValidate: true } as const;

/** Reads the product form's title and description for AI, and writes its drafts back. */
export function useProductAiWriter() {
  const { getValues, setValue } = useFormContext<ProductFormValues>();
  const restore = (values: Pick<ProductFormValues, 'title' | 'descriptionHtml'>) => {
    setValue('title', values.title, AS_EDIT);
    setValue('descriptionHtml', values.descriptionHtml, AS_EDIT);
  };
  return {
    getCurrent: (): ContentDraftCurrent => ({
      title: getValues('title'),
      descriptionHtml: getValues('descriptionHtml'),
    }),
    apply: (draft: ContentDraft) => {
      const previous = { title: getValues('title'), descriptionHtml: getValues('descriptionHtml') };
      if (draft.title !== null) setValue('title', draft.title, AS_EDIT);
      if (draft.descriptionHtml !== null)
        setValue('descriptionHtml', draft.descriptionHtml, AS_EDIT);
      return () => restore(previous);
    },
  };
}
