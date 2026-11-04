import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportIssueCode, ImportIssueOutcome } from '@/api/schema';
import { ImportJobIssues } from './ImportJobIssues';

const ISSUES = [
  {
    outcome: ImportIssueOutcome.FAILED,
    code: ImportIssueCode.unknown_sku,
    message: 'No variant in the catalog has this SKU',
    sku: 'NOPE-1',
    row: 2,
  },
  {
    outcome: ImportIssueOutcome.SKIPPED,
    code: ImportIssueCode.not_tracked,
    message: 'This variant does not track stock',
    sku: 'GIFT-1',
    row: 3,
  },
];

describe('ImportJobIssues', () => {
  it('lists every issue and filters them by outcome', async () => {
    render(<ImportJobIssues issues={ISSUES} />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);

    await userEvent.click(screen.getByRole('radio', { name: /Skipped/ }));

    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(within(table).getByText('This variant does not track stock')).toBeInTheDocument();
    expect(within(table).queryByText(/No variant/)).not.toBeInTheDocument();
  });

  it('says so when every row went through', () => {
    render(<ImportJobIssues issues={[]} />);

    expect(screen.getByText('Every row went through')).toBeInTheDocument();
  });

  it('names products, not rows, for channel imports', () => {
    render(
      <ImportJobIssues issues={[{ ...ISSUES[0]!, row: undefined, handle: 'tote' }]} fromChannel />,
    );

    expect(screen.getByRole('heading', { name: 'Products to review' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Row' })).not.toBeInTheDocument();
  });
});
