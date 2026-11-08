import { CheckCheck } from 'lucide-react';
import { PopoverHeader, PopoverTitle } from '@/components/ui/popover';
import { BELL_COPY } from '../notifications.constants';
import type { AccountNotice } from '../notifications.types';
import { NoticeItem } from './NoticeItem';

interface NoticeListProps {
  notices: AccountNotice[];
  onNavigate: () => void;
}

/** The bell's popover: every current notice, or that there is nothing to see. */
export function NoticeList({ notices, onNavigate }: NoticeListProps) {
  return (
    <>
      <PopoverHeader className="px-1">
        <PopoverTitle>{BELL_COPY.title}</PopoverTitle>
      </PopoverHeader>
      {notices.length === 0 ? (
        <p className="flex items-center gap-2 px-1 py-4 text-muted-foreground">
          <CheckCheck aria-hidden="true" className="size-4" />
          {BELL_COPY.empty}
        </p>
      ) : (
        <ul aria-label={BELL_COPY.title} className="flex flex-col divide-y px-1">
          {notices.map((notice) => (
            <NoticeItem key={notice.key} notice={notice} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </>
  );
}
