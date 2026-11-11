import type { PropsWithChildren } from 'react';

interface EditorSectionProps extends PropsWithChildren {
  title: string;
  /** Lets a link scroll straight to this section (`#id`). */
  id?: string;
}

/** A titled group of fields inside a card, such as the parts of More details. */
export function EditorSection({ title, id, children }: EditorSectionProps) {
  return (
    <section id={id} aria-label={title} className="flex scroll-mt-24 flex-col gap-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}
