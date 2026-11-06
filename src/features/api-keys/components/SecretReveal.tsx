import { CopyableValue } from '@/components/forms/CopyableValue';
import { API_KEY_FEEDBACK } from '../api-keys.constants';

/** The key, shown once, with a copy button. */
export function SecretReveal({ secret }: { secret: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <CopyableValue value={secret} copyLabel="Copy key" copiedMessage={API_KEY_FEEDBACK.copied} />
      <p className="text-sm text-muted-foreground">
        Copy it now. For your security it is stored only as a hash and cannot be shown again.
      </p>
    </div>
  );
}
