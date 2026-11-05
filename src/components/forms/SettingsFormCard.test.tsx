import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { SettingsFormCard } from './SettingsFormCard';

interface NameForm {
  name: string;
}

interface CardProps {
  canManage: boolean;
  saveError?: Error | null;
}

function NameCard({ canManage, saveError = null }: CardProps) {
  const form = useForm<NameForm>({ defaultValues: { name: 'Acme' } });
  return (
    <SettingsFormCard
      title="Name"
      description="What everyone sees."
      form={form}
      onSubmit={(event) => event.preventDefault()}
      canManage={canManage}
      saveLabel="Save name"
      saveError={saveError}
    >
      <label htmlFor="name">Name</label>
      <input id="name" {...form.register('name')} />
    </SettingsFormCard>
  );
}

describe('SettingsFormCard', () => {
  it('saves only once something changed', async () => {
    const user = userEvent.setup();
    render(<NameCard canManage />);
    const save = screen.getByRole('button', { name: 'Save name' });
    expect(screen.getByRole('heading', { name: 'Name' })).toBeInTheDocument();
    expect(save).toBeDisabled();

    await user.type(screen.getByLabelText('Name'), ' Goods');

    expect(save).toBeEnabled();
  });

  it('is read-only, without a save button, for members who cannot manage it', () => {
    render(<NameCard canManage={false} />);

    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Save name' })).not.toBeInTheDocument();
  });

  it('shows why the last save failed', () => {
    render(<NameCard canManage saveError={new Error('That name is taken')} />);

    expect(screen.getByText('That name is taken')).toBeInTheDocument();
  });
});
