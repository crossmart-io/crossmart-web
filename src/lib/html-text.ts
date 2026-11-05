const HTML_MIME_TYPE = 'text/html';
/** Block elements that start a new line of text. */
const BLOCK_TAGS = /<\/(p|h[1-6]|li|tr|blockquote|div)>|<br\s*\/?>/gi;
const LINE_BREAK = '\n';
const BLANK_LINES = /\n\s*\n+/g;

/**
 * The text of an HTML fragment, one block per line, for comparing and previewing descriptions
 * without rendering their markup. Parsed inertly: scripts never run and images never load.
 */
export function htmlToText(html: string): string {
  const withBreaks = html.replace(BLOCK_TAGS, (tag) => `${tag}${LINE_BREAK}`);
  const parsed = new DOMParser().parseFromString(withBreaks, HTML_MIME_TYPE);
  return (parsed.body.textContent ?? '').replace(BLANK_LINES, LINE_BREAK).trim();
}
