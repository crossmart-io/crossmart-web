import { HandCoins } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ConfirmTone } from '@/components/feedback/confirm-tone';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MARK_SOLD_COPY } from '../catalog.constants';
import { useMarkSold } from '../hooks/useMarkSold';
import { isSold, markSoldDescription, type SoldState } from './mark-sold';

interface MarkSoldMenuItemProps extends SoldState {
  workspaceId: string;
  productId: string;
  title: string;
}

/** "Mark as sold" in a row's menu; the confirm opens over the page once the menu closes. */
export function MarkSoldMenuItem({
  workspaceId,
  productId,
  title,
  ...state
}: MarkSoldMenuItemProps) {
  const markSold = useMarkSold(workspaceId, productId);
  const [confirming, setConfirming] = useState(false);
  const sold = isSold(state);
  return (
    <>
      <DropdownMenuItem disabled={sold} onSelect={() => setConfirming(true)}>
        <HandCoins />
        {sold ? MARK_SOLD_COPY.sold : MARK_SOLD_COPY.action}
      </DropdownMenuItem>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={MARK_SOLD_COPY.title(title)}
        description={markSoldDescription(state.storeNames)}
        confirmLabel={MARK_SOLD_COPY.action}
        tone={ConfirmTone.Default}
        onConfirm={() => markSold.mutateAsync()}
      />
    </>
  );
}
