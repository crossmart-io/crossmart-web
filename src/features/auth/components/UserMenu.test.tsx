import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CircleUser } from 'lucide-react';
import { MemoryRouter } from 'react-router';
import type { UserMenuLink } from '@/config/navigation';
import { useSession } from '../hooks/useSession';
import { UserMenu } from './UserMenu';

vi.mock('../hooks/useSession', () => ({ useSession: vi.fn<typeof useSession>() }));
vi.mock('../hooks/useSignOut', () => ({
  useSignOut: () => ({ isPending: false, mutate: vi.fn<() => void>() }),
}));
vi.mock('@/components/theme/ThemeSubMenu', () => ({ ThemeSubMenu: () => null }));

const LINKS: readonly UserMenuLink[] = [{ label: 'Account', to: '/account', icon: CircleUser }];

describe('UserMenu', () => {
  it("links to the person's own pages", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Dana Reseller', email: 'dana@example.com' } },
    } as ReturnType<typeof useSession>);
    render(
      <MemoryRouter>
        <UserMenu links={LINKS} />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Account menu' }));
    expect(screen.getByRole('menuitem', { name: 'Account' })).toHaveAttribute('href', '/account');
  });
});
