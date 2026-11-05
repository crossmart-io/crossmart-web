import { ContentField } from '@/api/schema';

export const CONTENT_DRAFTS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/ai/content-drafts';

/** Longest instruction the API takes. */
export const INSTRUCTION_MAX_LENGTH = 500;

/** One-click instructions, in the order merchants reach for them. */
export const QUICK_INSTRUCTIONS = [
  'Shorter',
  'More detailed',
  'More persuasive',
  'Fix spelling and grammar',
] as const;

export const AI_WRITER_COPY = {
  rewrite: 'Rewrite with AI',
  writeAll: 'Write with AI',
  writeAllHint: 'AI writes the title and description from the product. You review before saving.',
  instructionLabel: 'What should change?',
  instructionPlaceholder: 'Optional. For example: mention it is dishwasher-safe',
  submit: 'Rewrite',
  writing: 'Writing…',
  undo: 'Undo',
  notConfigured: 'AI is not configured on this server',
} as const;

/** The toast after a rewrite lands in the form, naming what changed. */
export const AI_WRITER_DONE = {
  title: 'Title rewritten. Review it, then save.',
  description: 'Description rewritten. Review it, then save.',
  both: 'Title and description rewritten. Review them, then save.',
} as const;

/** Both fields, for "Write with AI" over the whole listing text. */
export const ALL_CONTENT_FIELDS: readonly ContentField[] = [
  ContentField.title,
  ContentField.description,
];
