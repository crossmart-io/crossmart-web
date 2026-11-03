import { CatalogImportMode } from '@/api/schema';
import { describeActor, describeCounts, describeResult, processedCount } from './import-summary';

const NO_COUNTS = { created: 0, linked: 0, updated: 0, skipped: 0, failed: 0 };

const EMPTY_RESULT = {
  jobId: 'job-1',
  createdProducts: 0,
  createdVariants: 0,
  updatedProducts: 0,
  updatedVariants: 0,
  skipped: [],
  failed: [],
};

describe('import summaries', () => {
  it('lists only the counts that are not zero', () => {
    expect(describeCounts({ ...NO_COUNTS, created: 8, failed: 2 }, CatalogImportMode.create)).toBe(
      '8 created · 2 failed',
    );
    expect(describeCounts(NO_COUNTS, CatalogImportMode.update)).toBe('Nothing imported');
  });

  it('words channel imports in terms of links', () => {
    const counts = { ...NO_COUNTS, created: 3, linked: 2, updated: 5 };
    expect(describeCounts(counts, CatalogImportMode.create_or_link)).toBe(
      '3 created · 2 linked · 5 already linked',
    );
    expect(processedCount({ ...counts, skipped: 1, failed: 1 })).toBe(12);
  });

  it('names the API key a program used, and a removed member', () => {
    expect(
      describeActor({ userId: null, userName: null, apiKeyId: 'k', apiKeyName: 'Stock sync' }),
    ).toBe('Stock sync (API key)');
    expect(describeActor({ userId: 'u', userName: 'Dana', apiKeyId: null, apiKeyName: null })).toBe(
      'Dana',
    );
    expect(describeActor({ userId: null, userName: null, apiKeyId: null, apiKeyName: null })).toBe(
      'A removed member',
    );
  });

  it('words the headline for each mode', () => {
    expect(
      describeResult({ ...EMPTY_RESULT, mode: CatalogImportMode.update, updatedProducts: 3 }),
    ).toBe('Updated 3 products');
    expect(
      describeResult({ ...EMPTY_RESULT, mode: CatalogImportMode.inventory, updatedVariants: 1 }),
    ).toBe('Set stock for 1 variant');
  });
});
