import { CircleCheck, HandCoins } from 'lucide-react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ConfirmTone } from '@/components/feedback/confirm-tone';
import { Button } from '@/components/ui/button';
import { MARK_SOLD_COPY } from '../catalog.constants';
import { useMarkSold } from '../hooks/useMarkSold';
import { isSold, markSoldDescription, type SoldState } from './mark-sold';

interface MarkSoldButtonProps extends SoldState {
  workspaceId: string;
  productId: string;
  title: string;
}

/** Shown once nothing is left to sell, in place of the action. */
function SoldBadge() {
  return (
    <Button type="button" variant="outline" disabled>
      <CircleCheck data-icon="inline-start" />
      {MARK_SOLD_COPY.sold}
    </Button>
  );
}

/** For an item sold in person or elsewhere: confirms which stores it comes off, then does it. */
export function MarkSoldButton({ workspaceId, productId, title, ...state }: MarkSoldButtonProps) {
  const markSold = useMarkSold(workspaceId, productId);
  if (isSold(state)) return <SoldBadge />;
  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="outline">
          <HandCoins data-icon="inline-start" />
          {MARK_SOLD_COPY.action}
        </Button>
      }
      title={MARK_SOLD_COPY.title(title)}
      description={markSoldDescription(state.storeNames)}
      confirmLabel={MARK_SOLD_COPY.action}
      tone={ConfirmTone.Default}
      onConfirm={() => markSold.mutateAsync()}
    />
  );
}
