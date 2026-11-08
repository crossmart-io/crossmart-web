import { render, screen } from '@testing-library/react';
import { AgentState } from '../agent-console.constants';
import type { StoresStatus } from '../console-status';
import { ConsoleStatusBar } from './ConsoleStatusBar';

const STORES: StoresStatus = {
  total: 2,
  healthy: 1,
  liveListings: 14,
  failedListings: 2,
  needsDetailsListings: 3,
  lastSyncedAt: null,
};

function listingsFigure(stores: StoresStatus): string | null {
  render(<ConsoleStatusBar stores={stores} agent={AgentState.Idle} />);
  return screen.getByText('Listings').nextElementSibling?.textContent ?? null;
}

describe('ConsoleStatusBar', () => {
  it('shows the failed listings and those that need details beside the live ones', () => {
    expect(listingsFigure(STORES)).toBe('14 live· 2 failed· 3 need details');
  });

  it('says one listing needs details', () => {
    expect(listingsFigure({ ...STORES, needsDetailsListings: 1 })).toContain('1 needs details');
  });

  it('leaves out the figures that are zero', () => {
    expect(listingsFigure({ ...STORES, failedListings: 0, needsDetailsListings: 0 })).toBe(
      '14 live',
    );
  });
});
