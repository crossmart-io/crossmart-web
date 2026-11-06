import { SecretReveal } from '@/components/forms/SecretReveal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EXTERNAL_LINKS } from '@/config/links';
import { WEBHOOK_COPY, WEBHOOK_FEEDBACK } from '../webhooks.constants';

interface WebhookSecretDialogProps {
  /** The secret the API just returned; the dialog is open while there is one. */
  secret: string | undefined;
  url: string;
  onDone: () => void;
}

/** A signing secret, shown once after an endpoint is added or its secret rotated. */
export function WebhookSecretDialog({ secret, url, onDone }: WebhookSecretDialogProps) {
  return (
    <Dialog open={secret !== undefined} onOpenChange={(open) => !open && onDone()}>
      <DialogContent
        // The secret is shown only once: while it is on screen, only Done closes the dialog.
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{WEBHOOK_COPY.secretTitle}</DialogTitle>
          <DialogDescription className="break-all">For {url}</DialogDescription>
        </DialogHeader>
        {secret && (
          <SecretReveal
            secret={secret}
            copyLabel="Copy secret"
            copiedMessage={WEBHOOK_FEEDBACK.secretCopied}
          >
            <p className="font-medium text-foreground">{WEBHOOK_COPY.secretWarning}</p>
            <p>
              {WEBHOOK_COPY.secretVerify}{' '}
              <a
                href={EXTERNAL_LINKS.webhookSignatures}
                target="_blank"
                rel="noreferrer"
                className="text-brand underline-offset-4 hover:underline"
              >
                {WEBHOOK_COPY.secretVerifyLink}
              </a>
            </p>
          </SecretReveal>
        )}
        <DialogFooter>
          <Button onClick={onDone}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
