import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type AccountNotice, NoticeSeverity } from '../notifications.types';
import { NoticeActionButton } from './NoticeActionButton';
import { NoticeIcon } from './NoticeIcon';

/** A notice above the page, for what stops work or a deadline that is close. */
export function NoticeBanner({ notice }: { notice: AccountNotice }) {
  const variant = notice.severity === NoticeSeverity.Danger ? 'destructive' : 'default';
  return (
    <Alert variant={variant}>
      <NoticeIcon notice={notice} />
      <AlertTitle>{notice.title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3 [&_a]:no-underline">
        <span>{notice.body}</span>
        {notice.action && <NoticeActionButton action={notice.action} />}
      </AlertDescription>
    </Alert>
  );
}
