const WHITESPACE_RUNS = /\s+/g;

/**
 * Plain text of an HTML fragment, for previews. Text nodes are joined with spaces so blocks
 * (`<p>`, `<li>`) do not run together. DOMParser never runs scripts or loads resources, so
 * imported descriptions cannot inject anything into the page.
 */
export function htmlToText(html: string): string {
  const { body } = new DOMParser().parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    parts.push(node.textContent ?? '');
  }
  return parts.join(' ').replace(WHITESPACE_RUNS, ' ').trim();
}
