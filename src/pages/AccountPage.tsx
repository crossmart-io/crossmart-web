import { Page } from '@/components/layout/Page';
import { DeleteAccountCard, useMe } from '@/features/workspaces';

/** The signed-in person's account, from the user menu: closing it, as the privacy policy says. */
export function AccountPage() {
  const { data: me } = useMe();
  return (
    <Page name="Account">
      <div className="flex max-w-2xl flex-col gap-6">
        {me && <DeleteAccountCard email={me.email} />}
      </div>
    </Page>
  );
}
