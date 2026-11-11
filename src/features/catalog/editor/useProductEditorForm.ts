import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { toProductRoute } from '@/config/routes';
import { useSaveShortcut } from '@/hooks/useSaveShortcut';
import { EDITOR_FEEDBACK } from '../catalog.constants';
import type { Product } from '../catalog.types';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProductMutations';
import { emptyProductForm, toProductForm, toProductPayload } from './product-form.mappers';
import { productFormSchema, type ProductFormValues } from './product-form.schema';
import { type AfterCreate, SAVE_INTENT_STATUS, SaveIntent } from './save-intent';

function useSaveProduct(workspaceId: string, product: Product | undefined) {
  const create = useCreateProduct(workspaceId);
  const update = useUpdateProduct(workspaceId, product?.id ?? '');
  return product ? update : create;
}

function useProductForm(product: Product | undefined, readOnly: boolean) {
  return useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? toProductForm(product) : emptyProductForm(),
    // Disables every registered field, including those drawn by controllers.
    disabled: readOnly,
  });
}

interface EditorOptions {
  readOnly?: boolean;
  /** For a new product: runs once it is saved, and says where to go next. */
  afterCreate?: AfterCreate;
}

/** The product form, how it saves, and what the save bar needs to know. */
export function useProductEditorForm(
  workspaceId: string,
  product: Product | undefined,
  { readOnly = false, afterCreate }: EditorOptions = {},
) {
  const navigate = useNavigate();
  const save = useSaveProduct(workspaceId, product);
  const form = useProductForm(product, readOnly);
  const options = useWatch({ control: form.control, name: 'options' });
  const [pendingUploads, setPendingUploads] = useState(0);
  const { isDirty, isSubmitting } = form.formState;
  const hasChanges = !readOnly && (isDirty || !product);

  async function onSubmit(values: ProductFormValues, intent = SaveIntent.Publish) {
    let saved: Product;
    try {
      saved = await save.mutateAsync(toProductPayload(values));
    } catch {
      return; // Shown from the mutation state above the form.
    }
    form.reset(toProductForm(saved));
    if (product) return;
    const next = await afterCreate?.(saved, intent);
    await navigate(next?.to ?? toProductRoute(saved.id), { replace: true, state: next?.state });
  }

  const onInvalid = () => toast.error(EDITOR_FEEDBACK.invalid);
  const submit = form.handleSubmit((values) => onSubmit(values), onInvalid);
  const submitAs = (intent: SaveIntent) => {
    form.setValue('status', SAVE_INTENT_STATUS[intent]);
    void form.handleSubmit((values) => onSubmit(values, intent), onInvalid)();
  };
  useSaveShortcut(() => void submit(), hasChanges && !isSubmitting && pendingUploads === 0);
  const hasOptions = options.some((option) => option.values.length > 0);
  return {
    form,
    submit,
    submitAs,
    saveError: save.error,
    hasOptions,
    hasChanges,
    pendingUploads,
    setPendingUploads,
  };
}
