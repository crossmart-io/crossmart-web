/** The address that takes channel requests while the repositories are private. */
export const SUPPORT_EMAIL = 'hello@crossmart.io';

/** Public pages outside the app. */
export const EXTERNAL_LINKS = {
  docs: 'https://docs.crossmart.io',
  repository: 'https://github.com/crossmart-io/crossmart',
  issues: 'https://github.com/crossmart-io/crossmart/issues',
  webhooksGuide: 'https://docs.crossmart.io/developers/webhooks/',
  webhookSignatures: 'https://docs.crossmart.io/developers/webhooks/#verify-the-signature',
} as const;

const CHANNEL_REQUEST_SUBJECT = 'Channel request';

/** A mail link to Crossmart asking for a channel, named in the subject when one is given. */
export function channelRequestMailto(channelName?: string): string {
  const subject = channelName
    ? `${CHANNEL_REQUEST_SUBJECT}: ${channelName}`
    : CHANNEL_REQUEST_SUBJECT;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
