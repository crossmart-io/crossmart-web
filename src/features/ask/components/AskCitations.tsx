import { useId } from 'react';
import { ExternalLink } from 'lucide-react';
import { ASK_COPY } from '../ask.constants';
import type { AskCitation } from '../ask.types';
import { isWebUrl } from '../citation-url';

interface AskCitationsProps {
  citations: readonly AskCitation[];
}

/** The pages an answer is based on, numbered in the order the answer used them. */
export function AskCitations({ citations }: AskCitationsProps) {
  const headingId = useId();
  const links = citations.filter((citation) => isWebUrl(citation.url));
  if (!links.length) return null;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-1">
      <h3 id={headingId} className="text-xs font-medium text-muted-foreground">
        {ASK_COPY.sources}
      </h3>
      <ol className="flex list-decimal flex-col gap-1 ps-5 text-xs marker:text-muted-foreground">
        {links.map((citation) => (
          <li key={citation.url}>
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              dir="auto"
              className="inline-flex items-baseline gap-1 text-primary underline-offset-4 hover:underline focus-visible:underline"
            >
              {citation.title} <ExternalLink aria-hidden className="size-3 shrink-0 self-center" />
              <span className="sr-only">{ASK_COPY.opensInNewTab}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
