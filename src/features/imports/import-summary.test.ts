import { CatalogImportMode } from '@/api/schema';
import { describeActor, describeCounts, describeResult } from './import-summary';

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
    expect(describeCounts({ created: 8, updated: 0, skipped: 0, failed: 2 })).toBe(
      '8 created · 2 failed',
    );
    expect(describeCounts({ created: 0, updated: 0, skipped: 0, failed: 0 })).toBe(
      'Nothing imported',
    );
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
