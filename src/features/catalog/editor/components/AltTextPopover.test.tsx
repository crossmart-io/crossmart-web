import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AltTextPopover } from './AltTextPopover';

describe('AltTextPopover', () => {
  it('keeps what was typed when the popover is closed with Escape', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(altText: string) => void>();
    render(<AltTextPopover altText="" imageName="image 2" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Edit alt text of image 2' }));
    await user.type(screen.getByLabelText('Alt text'), 'Sand linen shirt, front');
    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledWith('Sand linen shirt, front');
  });

  it('commits on Enter without submitting the form around it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(altText: string) => void>();
    const onSubmit = vi.fn<(event: SubmitEvent) => void>((event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <AltTextPopover altText="Old" imageName="image 1" onChange={onChange} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Edit alt text of image 1' }));
    await user.clear(screen.getByLabelText('Alt text'));
    await user.type(screen.getByLabelText('Alt text'), 'New{Enter}');

    expect(onChange).toHaveBeenCalledWith('New');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
