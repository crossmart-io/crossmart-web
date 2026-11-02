import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

  function confirmDelete() {
    deleteProduct.mutate(undefined, {
      onSuccess: () => void navigate(ROUTES.products, { replace: true }),
    });
  }

  return (
    <div className="flex justify-end border-t pt-6">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="outline" className="text-destructive">
            <Trash2 />
            Delete product
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {title}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its variants, images and stock history are deleted too. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
            >
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
