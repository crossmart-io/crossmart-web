import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ResendVerificationButton } from '@/features/auth';
import { ClaimAccountButton } from '@/features/sandbox';
import { type NoticeAction, NoticeActionKind } from '../notifications.types';

interface NoticeActionButtonProps {
  action: NoticeAction;
  /** Called when the action leaves for another page, so the bell can close. */
  onNavigate?: () => void;
}

/** What the person can do about a notice: the same button in the bell and in a banner. */
export function NoticeActionButton({ action, onNavigate }: NoticeActionButtonProps) {
  switch (action.kind) {
    case NoticeActionKind.Link:
      return (
        <Button size="sm" variant="outline" asChild>
          <Link to={action.to} onClick={onNavigate}>
            {action.label}
          </Link>
        </Button>
      );
    case NoticeActionKind.ResendVerification:
      return <ResendVerificationButton email={action.email} />;
    case NoticeActionKind.ClaimSandbox:
      return (
        <div className="w-fit">
          <ClaimAccountButton workspaceId={action.workspaceId} />
        </div>
      );
  }
}
