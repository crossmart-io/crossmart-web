import { Button } from '@/components/ui/button';
import { PLAN_COPY } from '../plan.constants';

/** Where upgrading will start. Disabled until billing exists, and says so. */
export function UpgradeButton() {
  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <Button disabled aria-describedby="upgrade-billing-soon">
        {PLAN_COPY.upgrade}
      </Button>
      <span id="upgrade-billing-soon" className="text-xs text-muted-foreground">
        {PLAN_COPY.billingSoon}
      </span>
    </div>
  );
}
