import type { PropsWithChildren } from 'react';

/** An empty list, said in a sentence inside a dashed outline. */
export function EmptyNote({ children }: PropsWithChildren) {
  return (
    <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
