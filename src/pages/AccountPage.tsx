import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { DeleteAccountCard, useMe } from '@/features/workspaces';

/** Closing the account: everything only this user has is deleted, as the privacy policy says. */
export function AccountPage() {
  const { data: me } = useMe();
  return (
    <Page
      name="Account"
      parents={PAGE_PARENTS.settings}
      description="Delete your account, with the workspaces only you use."
    >
      <div className="flex max-w-2xl flex-col gap-6">
        {me && <DeleteAccountCard email={me.email} />}
      </div>
    </Page>
  );
}
