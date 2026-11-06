/** A piece of an activity summary: the log's own words, or a name the user typed. */
export interface SummaryPart {
  text: string;
  /** User content, such as a product title, which may be in another script direction. */
  isUserContent: boolean;
}

/** The API quotes user content in summaries with typographic quotes: Added “צמיד כסף”. */
const QUOTED_PATTERN = /“([^”]*)”/g;

/**
 * Splits a summary around its quoted names, so each name can be isolated with `<bdi>` and a
 * right-to-left title cannot pull the quote marks and the words around it out of place.
 */
export function splitSummary(summary: string): SummaryPart[] {
  const parts: SummaryPart[] = [];
  let cursor = 0;
  for (const match of summary.matchAll(QUOTED_PATTERN)) {
    const quoteStart = match.index;
    parts.push({ text: `${summary.slice(cursor, quoteStart)}“`, isUserContent: false });
    parts.push({ text: match[1] ?? '', isUserContent: true });
    parts.push({ text: '”', isUserContent: false });
    cursor = quoteStart + match[0].length;
  }
  parts.push({ text: summary.slice(cursor), isUserContent: false });
  return parts.filter((part) => part.text !== '' || part.isUserContent);
}
