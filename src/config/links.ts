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

/** A mail link to Crossmart about a channel, with the channel named in the subject. */
export function channelRequestMailto(channelName: string): string {
  const subject = encodeURIComponent(`Channel request: ${channelName}`);
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}`;
}
