import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  CatalogImportFormat,
  CatalogImportMode,
  ChannelConnectionStatus,
  ChannelType,
  ImportJobStatus,
} from '@/api/schema';
import type { ImportJobDetail } from '@/features/imports';
import type { ChannelConnection } from '../channels.types';
import { useChannelImport } from '../hooks/useChannelImport';
import { ChannelImportSection } from './ChannelImportSection';

vi.mock('../hooks/useChannelImport', () => ({
  useChannelImport: vi.fn<typeof useChannelImport>(),
}));

const CONNECTION = {
  id: 'c-1',
  channel: ChannelType.shopify,
  status: ChannelConnectionStatus.CONNECTED,
  lastSyncedAt: null,
} as ChannelConnection;

function job(overrides: Partial<ImportJobDetail>): ImportJobDetail {
  return {
    id: 'job-1',
    mode: CatalogImportMode.create_or_link,
    format: CatalogImportFormat.shopify_api,
    fileName: 'Demo Store',
    connectionId: 'c-1',
    totalCount: 12,
    status: ImportJobStatus.PROCESSING,
    counts: { created: 3, linked: 1, updated: 0, skipped: 0, failed: 0 },
    errorMessage: null,
    actor: { userId: 'u', userName: 'Dana', apiKeyId: null, apiKeyName: null },
    createdAt: '2026-11-03T09:00:00Z',
    finishedAt: null,
    issues: [],
    ...overrides,
  };
}

function renderSection(state: Partial<ReturnType<typeof useChannelImport>>) {
  const start = vi.fn<() => void>();
  vi.mocked(useChannelImport).mockReturnValue({
    job: undefined,
    start,
    isStarting: false,
    isRunning: false,
    error: null,
    ...state,
  });
  render(
    <MemoryRouter>
      <ChannelImportSection workspaceId="ws-1" connection={CONNECTION} channelName="Shopify" />
    </MemoryRouter>,
  );
  return { start };
}

describe('ChannelImportSection', () => {
  it('explains the import and starts it', async () => {
    const { start } = renderSection({});

    expect(screen.getByText(/linked, not copied/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Import products from Shopify' }));
    expect(start).toHaveBeenCalled();
  });

  it('shows the progress of a running import and links to it', () => {
    renderSection({ job: job({}), isRunning: true });

    expect(screen.getByText('Importing · 4 of 12 products')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Import progress' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Importing…' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'View in import history' })).toHaveAttribute(
      'href',
      '/imports/job-1',
    );
  });

  it('sums up a finished import', () => {
    renderSection({ job: job({ status: ImportJobStatus.COMPLETED }) });
    expect(screen.getByText('Import finished · 3 created · 1 linked')).toBeInTheDocument();
  });

  it('explains why an import stopped', () => {
    renderSection({
      job: job({ status: ImportJobStatus.FAILED, errorMessage: 'Connect the store again.' }),
    });
    expect(screen.getByText('Import stopped · Connect the store again.')).toBeInTheDocument();
  });
});
