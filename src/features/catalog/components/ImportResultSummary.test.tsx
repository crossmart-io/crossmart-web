import { render, screen } from '@testing-library/react';
import { ImportIssueCode } from '@/api/schema';
import { ImportResultSummary } from './ImportResultSummary';

describe('ImportResultSummary', () => {
  it('reports created, skipped and failed products', () => {
    render(
      <ImportResultSummary
        result={{
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
        }}
      />,
    );

    expect(screen.getByText('Imported 7 products with 15 variants')).toBeInTheDocument();
    expect(screen.getByText(/1 product was already in your catalog/)).toBeInTheDocument();
    expect(screen.getByText('1 product could not be imported')).toBeInTheDocument();
    expect(screen.getByText('Row 8:')).toBeInTheDocument();
  });

  it('stays quiet when nothing was skipped or failed', () => {
    render(
      <ImportResultSummary
        result={{ createdProducts: 1, createdVariants: 1, skipped: [], failed: [] }}
      />,
    );

    expect(screen.getByText('Imported 1 product with 1 variant')).toBeInTheDocument();
    expect(screen.queryByText(/could not be imported/)).not.toBeInTheDocument();
  });
});
