import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useDeleteProduct } from '../../hooks/useProductMutations';

interface DeleteProductSectionProps {
  workspaceId: string;
  productId: string;
  title: string;
}

export function DeleteProductSection({ workspaceId, productId, title }: DeleteProductSectionProps) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct(workspaceId, productId);

  async function confirmDelete() {
    await deleteProduct.mutateAsync();
    await navigate(ROUTES.products, { replace: true });
  }

  return (
    <div className="flex justify-end border-t pt-6">
      <ConfirmDialog
        trigger={
          <Button type="button" variant="destructive">
            <Trash2 data-icon="inline-start" />
            Delete product
          </Button>
        }
        title={`Delete ${title}?`}
        description="Its variants, images and stock history are deleted too. This cannot be undone."
        confirmLabel="Delete product"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
