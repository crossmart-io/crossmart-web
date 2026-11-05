import type { components } from '@/api/schema';

type Schemas = components['schemas'];

export type Suggestion = Schemas['SuggestionDto'];
export type BulkReviewResult = Schemas['BulkReviewResultDto'];
export type ContentGenerationReceipt = Schemas['ContentGenerationReceiptDto'];
