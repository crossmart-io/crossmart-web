import type { ReactNode } from 'react';
import { CopyableValue } from './CopyableValue';

interface SecretRevealProps {
  secret: string;
  /** The copy button's label, such as "Copy key". */
  copyLabel: string;
  /** The toast after a successful copy. */
  copiedMessage: string;
  /** Why it cannot be shown again, and what to do with it. */
  children: ReactNode;
}

/** A secret the API returns only once, with a copy button and what to know about it. */
export function SecretReveal({ secret, copyLabel, copiedMessage, children }: SecretRevealProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <CopyableValue value={secret} copyLabel={copyLabel} copiedMessage={copiedMessage} />
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
