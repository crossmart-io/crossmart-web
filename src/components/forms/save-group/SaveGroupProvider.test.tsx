import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { SettingsFormCard } from '../SettingsFormCard';
import { SaveGroupProvider } from './SaveGroupProvider';

interface NameForm {
  name: string;
}

interface CardProps {
  title: string;
  onSave: (name: string) => Promise<void>;
  requireChanges?: boolean;
}

function NameCard({ title, onSave, requireChanges }: CardProps) {
  const form = useForm<NameForm>({ defaultValues: { name: title } });
  const submit = form.handleSubmit(async (values) => {
    await onSave(values.name);
    form.reset(values);
  });
  return (
    <SettingsFormCard
      title={title}
      form={form}
      onSubmit={submit}
      canManage
      saveLabel={`Save ${title}`}
      saveError={null}
      requireChanges={requireChanges}
    >
      <label htmlFor={title}>{title}</label>
      <input id={title} {...form.register('name')} />
    </SettingsFormCard>
  );
}

function renderGroup(onSave = vi.fn<(name: string) => Promise<void>>().mockResolvedValue()) {
  render(
    <SaveGroupProvider>
      <NameCard title="Pricing" onSave={onSave} />
      <NameCard title="Rule" onSave={onSave} />
    </SaveGroupProvider>,
  );
  return onSave;
}

describe('SaveGroupProvider', () => {
  it('replaces each card’s save button with one bar that shows once something changed', async () => {
    const user = userEvent.setup();
    renderGroup();

    expect(screen.queryByRole('button', { name: 'Save Pricing' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Save changes' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Pricing'), ' 2');

    expect(screen.getByRole('region', { name: 'Save changes' })).toHaveTextContent(
      'Unsaved changes',
    );
  });

  it('saves every changed card with one click, and only those', async () => {
    const user = userEvent.setup();
    const onSave = renderGroup();
    await user.type(screen.getByLabelText('Pricing'), ' 2');
    await user.type(screen.getByLabelText('Rule'), ' 3');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(screen.queryByRole('region', { name: 'Save changes' })).not.toBeInTheDocument(),
    );
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenCalledWith('Pricing 2');
    expect(onSave).toHaveBeenCalledWith('Rule 3');
  });

  it('puts the cards back as they were on Discard', async () => {
    const user = userEvent.setup();
    renderGroup();
    await user.type(screen.getByLabelText('Rule'), ' 3');

    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(screen.getByLabelText('Rule')).toHaveValue('Rule');
    expect(screen.queryByRole('region', { name: 'Save changes' })).not.toBeInTheDocument();
  });

  it('offers to save an unfinished setup even before anything changed', () => {
    render(
      <SaveGroupProvider>
        <NameCard
          title="Setup"
          onSave={vi.fn<(name: string) => Promise<void>>()}
          requireChanges={false}
        />
      </SaveGroupProvider>,
    );

    expect(screen.getByRole('region', { name: 'Save changes' })).toHaveTextContent(
      'Setup not saved yet',
    );
    expect(screen.queryByRole('button', { name: 'Discard' })).not.toBeInTheDocument();
  });
});
