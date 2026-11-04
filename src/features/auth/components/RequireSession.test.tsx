import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ROUTES } from '@/config/routes';
import { useSession } from '../hooks/useSession';
import { RequireSession } from './RequireSession';

vi.mock('../hooks/useSession', () => ({ useSession: vi.fn<typeof useSession>() }));

const PROTECTED_TEXT = 'Protected content';
const SIGN_IN_TEXT = 'Sign-in screen';

type SessionState = ReturnType<typeof useSession>;

function mockSession(state: Partial<SessionState>): void {
  vi.mocked(useSession).mockReturnValue({ data: null, isPending: false, ...state } as SessionState);
}

function renderAt(path: string): void {
  const router = createMemoryRouter(
    [
      { path: ROUTES.signIn, element: <p>{SIGN_IN_TEXT}</p> },
      {
        path: ROUTES.home,
        element: (
          <RequireSession>
            <p>{PROTECTED_TEXT}</p>
          </RequireSession>
        ),
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

describe('RequireSession', () => {
  it('shows a loader while the session is loading', () => {
    mockSession({ isPending: true });
    renderAt(ROUTES.home);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('sends signed-out visitors to sign-in', () => {
    mockSession({ data: null });
    renderAt(ROUTES.home);
    expect(screen.getByText(SIGN_IN_TEXT)).toBeInTheDocument();
  });

  it('renders the page for a signed-in user', () => {
    mockSession({ data: {} as SessionState['data'] });
    renderAt(ROUTES.home);
    expect(screen.getByText(PROTECTED_TEXT)).toBeInTheDocument();
  });
});
