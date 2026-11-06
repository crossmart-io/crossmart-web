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

function useSaveProduct(workspaceId: string, product: Product | undefined) {
  const create = useCreateProduct(workspaceId);
  const update = useUpdateProduct(workspaceId, product?.id ?? '');
  return product ? update : create;
}

/** The product form, how it saves, and what the save bar needs to know. */
export function useProductEditorForm(
  workspaceId: string,
  product: Product | undefined,
  readOnly = false,
) {
  const navigate = useNavigate();
  const save = useSaveProduct(workspaceId, product);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? toProductForm(product) : emptyProductForm(),
    // Disables every registered field, including those drawn by controllers.
    disabled: readOnly,
  });
  const options = useWatch({ control: form.control, name: 'options' });
  const [pendingUploads, setPendingUploads] = useState(0);
  const { isDirty, isSubmitting } = form.formState;
  const hasChanges = !readOnly && (isDirty || !product);

  async function onSubmit(values: ProductFormValues) {
    try {
      const saved = await save.mutateAsync(toProductPayload(values));
      form.reset(toProductForm(saved));
      if (!product) await navigate(toProductRoute(saved.id), { replace: true });
    } catch {
      // Shown from the mutation state above the form.
    }
  }

  const submit = form.handleSubmit(onSubmit, () => toast.error(EDITOR_FEEDBACK.invalid));
  useSaveShortcut(() => void submit(), hasChanges && !isSubmitting && pendingUploads === 0);

  return {
    form,
    submit,
    saveError: save.error,
    hasOptions: options.some((option) => option.values.length > 0),
    hasChanges,
    pendingUploads,
    setPendingUploads,
  };
}
