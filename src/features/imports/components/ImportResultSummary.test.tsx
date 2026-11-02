import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CatalogImportMode, ImportIssueCode } from '@/api/schema';
import type { CatalogImportResult } from '../imports.types';
import { ImportResultSummary } from './ImportResultSummary';

const EMPTY_RESULT: CatalogImportResult = {
  jobId: 'job-1',
  mode: CatalogImportMode.create,
  createdProducts: 0,
  createdVariants: 0,
  updatedProducts: 0,
  updatedVariants: 0,
  skipped: [],
  failed: [],
};

function renderSummary(result: CatalogImportResult) {
  render(
    <MemoryRouter>
      <ImportResultSummary result={result} />
    </MemoryRouter>,
  );
}

describe('ImportResultSummary', () => {
  it('reports created, skipped and failed products', () => {
    renderSummary({
      ...EMPTY_RESULT,
      createdProducts: 7,
      createdVariants: 15,
      skipped: [{ code: ImportIssueCode.already_exists, message: 'exists', handle: 'mug' }],
      failed: [
        {
          code: ImportIssueCode.invalid_value,
          message: 'Variant Price "five" is not a valid price',
          handle: 'tote',
          row: 8,
        },
      ],
    });

    expect(screen.getByText('Imported 7 products with 15 variants')).toBeInTheDocument();
    expect(screen.getByText('1 product was left unchanged')).toBeInTheDocument();
    expect(screen.getByText('They are already in your catalog.')).toBeInTheDocument();
    expect(screen.getByText('1 product could not be imported')).toBeInTheDocument();
    expect(screen.getByText('Row 8:')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See it in the import history' })).toHaveAttribute(
      'href',
      '/imports/job-1',
    );
  });

  it('lists why stock rows were skipped or failed', () => {
    renderSummary({
      ...EMPTY_RESULT,
      mode: CatalogImportMode.inventory,
      updatedVariants: 4,
      skipped: [
        { code: ImportIssueCode.not_tracked, message: 'does not track stock', sku: 'GIFT', row: 3 },
      ],
      failed: [{ code: ImportIssueCode.unknown_sku, message: 'No variant', sku: 'NOPE', row: 5 }],
    });

    expect(screen.getByText('Set stock for 4 variants')).toBeInTheDocument();
    expect(screen.getByText('1 row was left unchanged')).toBeInTheDocument();
    expect(screen.getByText('GIFT')).toBeInTheDocument();
    expect(screen.getByText('1 row could not be imported')).toBeInTheDocument();
  });

  it('stays quiet when nothing was skipped or failed', () => {
    renderSummary({ ...EMPTY_RESULT, createdProducts: 1, createdVariants: 1 });

    expect(screen.getByText('Imported 1 product with 1 variant')).toBeInTheDocument();
    expect(screen.queryByText(/could not be imported/)).not.toBeInTheDocument();
  });
});
