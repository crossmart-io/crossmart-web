import { render, screen } from '@testing-library/react';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import { ChangePreview } from './ChangePreview';

describe('ChangePreview', () => {
  it('shows short values side by side, such as a price', () => {
    render(<ChangePreview changes={[{ label: 'Price (M)', before: '$24.00', after: '$19.00' }]} />);
    expect(screen.getByText('Price (M)')).toBeInTheDocument();
    expect(screen.getByText('$24.00')).toHaveClass('line-through');
    expect(screen.getByText('$19.00')).toBeInTheDocument();
    expect(screen.getByLabelText(AGENT_WORKER_COPY.changesTo)).toBeInTheDocument();
    expect(screen.queryByText(AGENT_WORKER_COPY.before)).not.toBeInTheDocument();
  });

  it('shows a word diff for long text', () => {
    const long = 'A soft linen shirt with a relaxed fit, mother-of-pearl buttons and a curved hem.';
    render(
      <ChangePreview changes={[{ label: 'Description', before: long, after: `${long} New.` }]} />,
    );
    expect(screen.getByText(AGENT_WORKER_COPY.before)).toBeInTheDocument();
    expect(screen.getByText(AGENT_WORKER_COPY.after)).toBeInTheDocument();
  });

  it('shows only the value set when what it replaces is unknown, with nothing struck', () => {
    render(<ChangePreview changes={[{ label: 'Quantity', before: null, after: '20' }]} />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.queryByText(AGENT_WORKER_COPY.empty)).not.toBeInTheDocument();
  });
});
