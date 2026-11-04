import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { ResetPasswordForm } from './ResetPasswordForm';

function renderForm(props: { token: string | null; linkError: string | null }) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ResetPasswordForm {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ResetPasswordForm', () => {
  it('asks for a new password when the link is good', () => {
    renderForm({ token: 'abc', linkError: null });
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByRole('button', { name: 'Save new password' })).toBeInTheDocument();
  });

  it('explains an expired link and offers a new one', () => {
    renderForm({ token: null, linkError: 'INVALID_TOKEN' });
    expect(screen.getByText(/expired or was already used/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get a new link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });
});
