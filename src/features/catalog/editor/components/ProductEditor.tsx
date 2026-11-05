import type { ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import { FormError } from '@/components/feedback/FormError';
import type { Workspace } from '@/features/workspaces';
import { EDITOR_FEEDBACK } from '../../catalog.constants';
import type { Product } from '../../catalog.types';
import { useProductEditorForm } from '../useProductEditorForm';
import { DeleteProductSection } from './DeleteProductSection';
import { ProductEditorLayout } from './ProductEditorLayout';
import { SaveBar } from './SaveBar';
import { UnsavedChangesGuard } from './UnsavedChangesGuard';

const PRODUCT_FORM_ID = 'product-form';

interface ProductEditorProps {
  workspace: Workspace;
  /** Absent when creating a product. */
  product?: Product;
  /** Extra cards for the side column. */
  aside?: ReactNode;
  /** Where the product is listed, in place of the placeholder card. */
  channels?: ReactNode;
}

/** Create and edit a product, laid out like the store admins sellers already know. */
export function ProductEditor({ workspace, product, aside, channels }: ProductEditorProps) {
  const editor = useProductEditorForm(workspace.id, product);
  const { isDirty, isSubmitting } = editor.form.formState;

  return (
    <FormProvider {...editor.form}>
      {/* Room below the last section, so the floating save bar never covers it. */}
      <div className="pb-20">
        <form id={PRODUCT_FORM_ID} onSubmit={(event) => void editor.submit(event)} noValidate>
          {editor.hasChanges && (
            <SaveBar
              label={isDirty ? EDITOR_FEEDBACK.unsaved : EDITOR_FEEDBACK.newProduct}
              isSaving={isSubmitting}
              isBusy={editor.pendingUploads > 0}
              onDiscard={() => editor.form.reset()}
            />
          )}
          <UnsavedChangesGuard when={isDirty && !isSubmitting} />
          <FormError error={editor.saveError} className="mb-6" />
          <ProductEditorLayout
            workspaceId={workspace.id}
            productId={product?.id}
            currency={workspace.currency}
            hasOptions={editor.hasOptions}
            onPendingUploadsChange={editor.setPendingUploads}
            aside={aside}
            channels={channels}
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
      </div>
    </FormProvider>
  );
}
