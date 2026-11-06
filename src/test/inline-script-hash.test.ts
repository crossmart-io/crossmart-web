// @vitest-environment node
import indexHtml from '../../index.html?raw';
import securityHeaders from '../../security-headers.conf?raw';

const INLINE_SCRIPT = /<script>([\s\S]*?)<\/script>/;

async function sha256Base64(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

describe('Content-Security-Policy', () => {
  it('allows the inline theme script in index.html by its current hash', async () => {
    const script = INLINE_SCRIPT.exec(indexHtml)?.[1];
    expect(script).toBeDefined();

    const hash = await sha256Base64(script ?? '');

    expect(securityHeaders).toContain(`'sha256-${hash}'`);
  });
});
