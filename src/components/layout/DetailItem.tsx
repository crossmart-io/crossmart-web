import type { PropsWithChildren } from 'react';

/** One term of a description list: a small label over its value. */
export function DetailItem({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm break-words">{children}</dd>
    </div>
  );
}
