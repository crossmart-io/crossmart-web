import { render, screen } from '@testing-library/react';
import { SystemStatus } from '../system-status.enum';
import { SystemStatusBadge } from './SystemStatusBadge';

describe('SystemStatusBadge', () => {
  it.each([
    [SystemStatus.Checking, 'Checking…'],
    [SystemStatus.Operational, 'Operational'],
    [SystemStatus.Degraded, 'Degraded'],
    [SystemStatus.Unavailable, 'Unavailable'],
  ])('renders %s as "%s"', (status, label) => {
    render(<SystemStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
