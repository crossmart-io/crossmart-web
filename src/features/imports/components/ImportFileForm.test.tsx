import { render, screen } from '@testing-library/react';
import { CatalogImportMode } from '@/api/schema';
import { INVENTORY_EXAMPLE, PRODUCTS_EXAMPLE, type FileImportMode } from '../imports.constants';
import { ImportFileForm } from './ImportFileForm';

function renderForm(mode: FileImportMode) {
  render(
    <ImportFileForm
      formId="import-form"
      mode={mode}
      onModeChange={vi.fn<(mode: FileImportMode) => void>()}
      error={null}
      onFileChange={vi.fn<(file: File | null) => void>()}
      onSubmit={vi.fn<() => void>()}
    />,
  );
  return screen.getByRole('link', { name: 'Download example file' });
}

describe('ImportFileForm', () => {
  it.each([CatalogImportMode.create, CatalogImportMode.update] as const)(
    'offers the product example in %s mode',
    (mode) => {
      const link = renderForm(mode);
      expect(link).toHaveAttribute('href', PRODUCTS_EXAMPLE.href);
      expect(link).toHaveAttribute('download', PRODUCTS_EXAMPLE.fileName);
    },
  );

  it('offers the stock example in inventory mode', () => {
    expect(renderForm(CatalogImportMode.inventory)).toHaveAttribute('href', INVENTORY_EXAMPLE.href);
  });
});
