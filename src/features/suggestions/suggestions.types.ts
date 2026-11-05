import type { components } from '@/api/schema';

type Schemas = components['schemas'];

export type Suggestion = Schemas['SuggestionDto'];
export type SuggestionPage = Schemas['SuggestionPageDto'];
export type BulkReviewResult = Schemas['BulkReviewResultDto'];
export type AiStatus = Schemas['AiStatusDto'];
export type ContentGenerationReceipt = Schemas['ContentGenerationReceiptDto'];
