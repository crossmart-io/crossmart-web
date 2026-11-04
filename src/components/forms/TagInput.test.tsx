import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TagInput } from './TagInput';

function Harness({ initial = [] }: { initial?: string[] }) {
  const [tags, setTags] = useState(initial);
  return <TagInput id="tags" value={tags} onChange={setTags} placeholder="Add a tag" />;
}

describe('TagInput', () => {
  it('adds a tag on Enter and on comma, ignoring duplicates', async () => {
    render(<Harness />);
    const input = screen.getByPlaceholderText('Add a tag');

    await userEvent.type(input, 'wool{Enter}linen,Wool{Enter}');

    expect(screen.getByText('wool')).toBeInTheDocument();
    expect(screen.getByText('linen')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Remove/ })).toHaveLength(2);
  });

  it('removes the last tag with Backspace on an empty input', async () => {
    render(<Harness initial={['a1', 'b2']} />);

    await userEvent.type(screen.getByRole('textbox'), '{Backspace}');

    expect(screen.queryByText('b2')).not.toBeInTheDocument();
    expect(screen.getByText('a1')).toBeInTheDocument();
  });

  it('announces what was added and removed', async () => {
    render(<Harness initial={['wool']} />);

    await userEvent.type(screen.getByRole('textbox'), 'linen{Enter}');
    expect(screen.getByText('Added linen')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Remove wool' }));
    expect(screen.getByText('Removed wool')).toBeInTheDocument();
  });
});
