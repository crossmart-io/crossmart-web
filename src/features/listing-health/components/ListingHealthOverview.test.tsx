import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ListingDisplayState } from '@/api/schema';
import {
  failureFixture,
  reportFixture,
  storeHealthFixture,
} from '../testing/listing-health.fixture';
import { RecentFailuresCard } from './RecentFailuresCard';
import { StoresHealthCard } from './StoresHealthCard';

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe('StoresHealthCard', () => {
  it('shows each store’s products by state, with what is not in it', () => {
    const store = storeHealthFixture({
      [ListingDisplayState.published]: 7,
      [ListingDisplayState.failed]: 2,
      [ListingDisplayState.draft]: 40,
    });
    renderInRouter(<StoresHealthCard stores={[store]} />);
    expect(screen.getByRole('link', { name: /North shop/ })).toHaveAttribute(
      'href',
      '/channels/c-1',
    );
    expect(screen.getByText('Published').nextSibling).toHaveTextContent('7');
    expect(screen.getByText('Failed').nextSibling).toHaveTextContent('2');
    expect(screen.queryByText('Removing')).not.toBeInTheDocument();
    expect(screen.getByText('Not in the store: 40 draft · 0 removed')).toBeInTheDocument();
  });

  it('says a store is empty rather than drawing an empty bar', () => {
    renderInRouter(<StoresHealthCard stores={[storeHealthFixture()]} />);
    expect(screen.getByText('No products in this store yet.')).toBeInTheDocument();
  });

  it('asks a workspace without stores to connect one', () => {
    renderInRouter(<StoresHealthCard stores={[]} />);
    expect(screen.getByRole('link', { name: 'Connect a store' })).toHaveAttribute(
      'href',
      '/channels',
    );
  });
});

describe('RecentFailuresCard', () => {
  it('links each failure to the exact fix', () => {
    renderInRouter(<RecentFailuresCard report={reportFixture()} workspaceId="ws-1" canEdit />);
    expect(screen.getByRole('link', { name: 'Blue mug' })).toHaveAttribute('href', '/products/p-1');
    expect(screen.getByText('North shop')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Fill in item specifics/ })).toHaveAttribute(
      'href',
      '/products/p-1?override=c-1',
    );
  });

  it('says how many failed in all when there are more than it lists', () => {
    renderInRouter(
      <RecentFailuresCard
        report={reportFixture({ failedListings: 9 })}
        workspaceId="ws-1"
        canEdit
      />,
    );
    expect(screen.getByText('9 failed in all')).toBeInTheDocument();
  });

  it('offers no retry while the store needs reconnecting', () => {
    const report = reportFixture({
      stores: [storeHealthFixture({}, { status: ChannelConnectionStatus.NEEDS_REAUTH })],
      recentFailures: [
        failureFixture({
          displayState: ListingDisplayState.failed,
          displayRequirement: null,
          missingRequirement: null,
          displayReason: 'Shopify rejected the title',
        }),
      ],
    });
    renderInRouter(<RecentFailuresCard report={report} workspaceId="ws-1" canEdit />);
    expect(screen.getByText('Shopify rejected the title')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Try again/ })).not.toBeInTheDocument();
  });

  it('says when nothing failed', () => {
    renderInRouter(
      <RecentFailuresCard
        report={reportFixture({ recentFailures: [], failedListings: 0 })}
        workspaceId="ws-1"
        canEdit
      />,
    );
    expect(screen.getByText('No listing failed on any store.')).toBeInTheDocument();
  });
});
