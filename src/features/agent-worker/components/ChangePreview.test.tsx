import { render, screen } from '@testing-library/react';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import { ChangePreview } from './ChangePreview';

describe('ChangePreview', () => {
  it('shows a before and after diff when the current value is known', () => {
    render(<ChangePreview changes={[{ field: 'title', before: 'Mug', after: 'Big Mug' }]} />);
    expect(screen.getByText(AGENT_WORKER_COPY.before)).toBeInTheDocument();
    expect(screen.getByText(AGENT_WORKER_COPY.after)).toBeInTheDocument();
  });

  it('shows only the value set when what it replaces is unknown, with nothing struck', () => {
    render(<ChangePreview changes={[{ field: 'quantity', before: null, after: '20' }]} />);
    expect(screen.getByText(AGENT_WORKER_COPY.sets)).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.queryByText(AGENT_WORKER_COPY.empty)).not.toBeInTheDocument();
  });
});
