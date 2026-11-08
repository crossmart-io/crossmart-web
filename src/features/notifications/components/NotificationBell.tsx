import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSession } from '@/features/auth';
import { useAccountNotices } from '../hooks/useAccountNotices';
import { BELL_COPY } from '../notifications.constants';
import { markNoticesSeen, unseenNotices, useSeenNotices } from '../seen-notices';
import { NoticeList } from './NoticeList';
import { UnreadBadge } from './UnreadBadge';

/** The bell in the app header: the account's notices, with a count of the ones not yet seen. */
export function NotificationBell() {
  const notices = useAccountNotices();
  const userId = useSession().data?.user.id;
  const unseenCount = unseenNotices(notices, useSeenNotices(userId)).length;
  const [open, setOpen] = useState(false);
  const label = unseenCount > 0 ? BELL_COPY.labelWithNew(unseenCount) : BELL_COPY.label;

  function changeOpen(next: boolean): void {
    setOpen(next);
    if (next && userId) markNoticesSeen(userId, notices);
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={label} className="relative">
              <Bell />
              <UnreadBadge count={unseenCount} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{BELL_COPY.label}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <NoticeList notices={notices} onNavigate={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
