import type { PropsWithChildren, ReactNode } from 'react';

interface LabelRowProps extends PropsWithChildren {
  /** A small action at the end of the row, such as a rewrite button. */
  action?: ReactNode;
}

/** A field's label with an optional action beside it. */
export function LabelRow({ action, children }: LabelRowProps) {
  if (!action) return children;
  return (
    <div className="flex min-h-6 items-center justify-between gap-2">
      {children}
      {action}
    </div>
  );
}
