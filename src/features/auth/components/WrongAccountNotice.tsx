import { Button } from '@/components/ui/button';
import { useSignOut } from '../hooks/useSignOut';

interface WrongAccountNoticeProps {
  signedInAs: string;
  /** What to do after signing out, such as which address to sign in with. */
  instruction: string;
}

/** For a link meant for another account: says who is signed in, and offers to sign out. */
export function WrongAccountNotice({ signedInAs, instruction }: WrongAccountNoticeProps) {
  const signOut = useSignOut();
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        You are signed in as {signedInAs}. {instruction}
      </p>
      <Button variant="outline" disabled={signOut.isPending} onClick={() => signOut.mutate()}>
        Sign out
      </Button>
    </div>
  );
}
