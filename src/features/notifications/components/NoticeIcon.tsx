import { cn } from '@/lib/utils';
import { NOTICE_ICON_TONES, NOTICE_ICONS } from '../notifications.constants';
import type { AccountNotice } from '../notifications.types';

interface NoticeIconProps {
  notice: Pick<AccountNotice, 'kind' | 'severity'>;
  /** Colored by severity; off inside an alert, which colors its own icon. */
  toned?: boolean;
  className?: string;
}

/** The notice's icon, decorative: its title says what it is. */
export function NoticeIcon({ notice, toned = false, className }: NoticeIconProps) {
  const Icon = NOTICE_ICONS[notice.kind];
  return (
    <Icon
      aria-hidden="true"
      className={cn(toned && NOTICE_ICON_TONES[notice.severity], className)}
    />
  );
}
