import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  ActivityAction,
  ActivityActorType,
  ActivityOutcome,
  ActivitySubjectType,
} from '@/api/schema';
import { toImportJobRoute, toProductRoute } from '@/config/routes';
import type { ActivityEvent } from '../activity.types';
import { ActivityEventItem } from './ActivityEventItem';

const BASE_EVENT: ActivityEvent = {
  id: 'event-1',
  action: ActivityAction.product_updated,
  outcome: ActivityOutcome.SUCCEEDED,
  summary: 'Updated product “Mug”',
  actor: {
    type: ActivityActorType.API_KEY,
    userId: null,
    apiKeyId: 'key-1',
    name: 'Catalog agent',
    email: null,
  },
  subject: { type: ActivitySubjectType.product, id: 'p-1', label: 'Mug' },
  itemCount: null,
  failureReason: null,
  createdAt: new Date().toISOString(),
};

function renderItem(event: ActivityEvent, pageSubjectId?: string) {
  return render(
    <MemoryRouter>
      <ul>
        <ActivityEventItem event={event} pageSubjectId={pageSubjectId} />
      </ul>
    </MemoryRouter>,
  );
}

describe('ActivityEventItem', () => {
  it('links the subject and names the API key that acted', () => {
    renderItem(BASE_EVENT);

    expect(screen.getByRole('link', { name: 'Updated product “Mug”' })).toHaveAttribute(
      'href',
      toProductRoute('p-1'),
    );
    expect(screen.getByText('Catalog agent')).toBeInTheDocument();
    expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  });

  it('marks a failure, says why and links to the import', () => {
    renderItem({
      ...BASE_EVENT,
      action: ActivityAction.products_imported,
      outcome: ActivityOutcome.FAILED,
      summary: 'Product import failed',
      subject: { type: ActivitySubjectType.import_job, id: 'job-1', label: 'products.csv' },
      failureReason: 'The file is not a readable CSV',
    });

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('The file is not a readable CSV')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Product import failed' })).toHaveAttribute(
      'href',
      toImportJobRoute('job-1'),
    );
  });

  it('on a product’s page, links imports that touched it but not the product itself', () => {
    const { unmount } = renderItem(BASE_EVENT, 'p-1');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    unmount();

    renderItem(
      {
        ...BASE_EVENT,
        action: ActivityAction.stock_imported,
        summary: 'Set stock of 2 variants from “stock.csv”',
        subject: { type: ActivitySubjectType.import_job, id: 'job-1', label: 'stock.csv' },
      },
      'p-1',
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', toImportJobRoute('job-1'));
  });
});
