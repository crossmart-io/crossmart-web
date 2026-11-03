import { render, screen } from '@testing-library/react';
import { FilterSelect } from './FilterSelect';
import { toFilterOptions } from './filter-options';

const OPTIONS = toFilterOptions({ failed: 'Failed', completed: 'Completed' });

describe('FilterSelect', () => {
  it('builds its options from an enum’s labels, in order', () => {
    expect(OPTIONS).toEqual([
      { value: 'failed', label: 'Failed' },
      { value: 'completed', label: 'Completed' },
    ]);
  });

  it('shows the chosen value, or the label that filters nothing', () => {
    const onChange = vi.fn<(value: string | undefined) => void>();
    const { rerender } = render(
      <FilterSelect
        options={OPTIONS}
        value={undefined}
        onChange={onChange}
        anyLabel="All statuses"
        label="Filter by status"
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Filter by status' })).toHaveTextContent(
      'All statuses',
    );

    rerender(
      <FilterSelect
        options={OPTIONS}
        value="failed"
        onChange={onChange}
        anyLabel="All statuses"
        label="Filter by status"
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Filter by status' })).toHaveTextContent('Failed');
  });
});
