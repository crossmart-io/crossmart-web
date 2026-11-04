import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toProductRoute } from '@/config/routes';
import type { Workspace } from '@/features/workspaces';
import type { Product } from '../../catalog.types';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProductMutations';
import { emptyProductForm, toProductForm, toProductPayload } from '../product-form.mappers';
import { productFormSchema, type ProductFormValues } from '../product-form.schema';
import { DeleteProductSection } from './DeleteProductSection';
import { ProductEditorLayout } from './ProductEditorLayout';
import { SaveBar } from './SaveBar';
import { UnsavedChangesGuard } from './UnsavedChangesGuard';

export const PRODUCT_FORM_ID = 'product-form';

interface ProductEditorProps {
  workspace: Workspace;
  /** Absent when creating a product. */
  product?: Product;
}

function useSaveProduct(workspaceId: string, product: Product | undefined) {
  const create = useCreateProduct(workspaceId);
  const update = useUpdateProduct(workspaceId, product?.id ?? '');
  return product ? update : create;
}

/** Create and edit a product, laid out like the store admins sellers already know. */
export function ProductEditor({ workspace, product }: ProductEditorProps) {
  const navigate = useNavigate();
  const save = useSaveProduct(workspace.id, product);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? toProductForm(product) : emptyProductForm(),
  });
  const options = useWatch({ control: form.control, name: 'options' });
  const hasOptions = options.some((option) => option.values.length > 0);
  const { isDirty, isSubmitting } = form.formState;

  async function onSubmit(values: ProductFormValues) {
    try {
      const saved = await save.mutateAsync(toProductPayload(values));
      form.reset(toProductForm(saved));
      if (!product) await navigate(toProductRoute(saved.id), { replace: true });
    } catch {
      // Shown from the mutation state above the form.
    }
  }

  return (
    <FormProvider {...form}>
      <form id={PRODUCT_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {(isDirty || !product) && (
          <SaveBar
            label={isDirty ? 'Unsaved changes' : 'New product'}
            isSaving={isSubmitting}
            onDiscard={() => form.reset()}
          />
        )}
        <UnsavedChangesGuard when={isDirty && !isSubmitting} />
        {save.error && (
          <Alert variant="destructive" className="mb-6">
            <CircleAlert />
            <AlertDescription>{save.error.message}</AlertDescription>
          </Alert>
        )}
        <ProductEditorLayout
          workspaceId={workspace.id}
          currency={workspace.currency}
          hasOptions={hasOptions}
        />
      </form>
      {product && (
        <div className="mt-6">
          <DeleteProductSection
            workspaceId={workspace.id}
            productId={product.id}
            title={product.title}
          />
        </div>
      )}
    </FormProvider>
  );
}
