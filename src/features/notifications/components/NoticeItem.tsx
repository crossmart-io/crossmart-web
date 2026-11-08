import type { AccountNotice } from '../notifications.types';
import { NoticeActionButton } from './NoticeActionButton';
import { NoticeIcon } from './NoticeIcon';

interface NoticeItemProps {
  notice: AccountNotice;
  onNavigate: () => void;
}

/** One notice in the bell: icon, title, what it means, and the action for it. */
export function NoticeItem({ notice, onNavigate }: NoticeItemProps) {
  return (
    <li className="flex gap-3 py-3">
      <NoticeIcon notice={notice} toned className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-medium">{notice.title}</p>
        <p className="text-xs/relaxed text-muted-foreground">{notice.body}</p>
        {notice.action && (
          <div className="pt-1">
            <NoticeActionButton action={notice.action} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </li>
  );
}
