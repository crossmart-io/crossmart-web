import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { EnumSelectField } from './EnumSelectField';

enum Size {
  Small = 'small',
  Large = 'large',
}

const OPTIONS = [
  { value: Size.Small, label: 'Small' },
  { value: Size.Large, label: 'Large' },
];

interface SizeForm {
  size: Size;
}

function SizeSelect({ onSubmit }: { onSubmit: (values: SizeForm) => void }) {
  const { control, handleSubmit } = useForm<SizeForm>({ defaultValues: { size: Size.Small } });
  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      <label htmlFor="size">Size</label>
      <EnumSelectField control={control} name="size" id="size" options={OPTIONS} />
      <button type="submit">Save</button>
    </form>
  );
}

beforeAll(() => {
  // Radix Select measures and captures the pointer, which jsdom does not implement.
  Element.prototype.scrollIntoView = vi.fn<() => void>();
  Element.prototype.hasPointerCapture = vi.fn<() => boolean>(() => false);
  Element.prototype.releasePointerCapture = vi.fn<() => void>();
});

describe('EnumSelectField', () => {
  it('shows the form’s value and sets the option the user picks', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(values: SizeForm) => void>();
    render(<SizeSelect onSubmit={onSubmit} />);
    const trigger = screen.getByRole('combobox', { name: 'Size' });
    expect(trigger).toHaveTextContent('Small');

    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Large' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(trigger).toHaveTextContent('Large');
    expect(onSubmit).toHaveBeenCalledWith({ size: Size.Large }, expect.anything());
  });
});
