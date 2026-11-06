import { AskFailure } from './ask.types';

export const ASK_ENDPOINT = '/api/v1/ask';

/** The question length the API accepts. */
export const ASK_QUESTION_MIN_LENGTH = 3;
export const ASK_QUESTION_MAX_LENGTH = 500;

/** Questions offered before the first one, so the panel never starts blank. */
export const ASK_SUGGESTED_QUESTIONS = [
  'How do I connect my Shopify store?',
  'Can I publish one product to several channels?',
  'How do AI agents use Crossmart?',
] as const;

/** Only web pages become citation links. */
export const CITATION_PROTOCOLS: readonly string[] = ['https:', 'http:'];

export const ASK_COPY = {
  launcher: 'Help',
  title: 'Ask Crossmart',
  description:
    'An AI assistant that answers from the Crossmart docs. It can be wrong, so check the sources it links.',
  suggestionsLabel: 'Try asking',
  questionLabel: 'Your question',
  questionPlaceholder: 'Ask about channels, plans, the API…',
  keyboardHint: 'to ask, Shift + Enter for a new line',
  submit: 'Ask',
  thinking: 'Looking through the docs…',
  you: 'You asked',
  assistant: 'Crossmart answered',
  sources: 'Sources',
  opensInNewTab: '(opens in a new tab)',
  handoff: 'Ask a person',
  browseDocs: 'Browse the docs',
} as const;

/** What each failure is called; the API's own message, when it has one, follows it. */
export const ASK_FAILURE_TITLES: Record<AskFailure, string> = {
  [AskFailure.RateLimited]: 'That’s a lot of questions at once',
  [AskFailure.Unavailable]: 'Ask Crossmart is not available right now',
  [AskFailure.Offline]: 'Crossmart could not be reached',
  [AskFailure.Failed]: 'Something went wrong',
};

export const ASK_RATE_LIMITED_DETAIL = 'Wait a minute, then ask again. The docs are always open.';
