import { ExternalLink } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { CREDENTIALS_DIALOG_COPY, type CredentialsConnectableChannel } from '../channels.constants';
import { type CredentialValues, isComplete, toSellerCredentials } from '../credentials-form';
import { useConnectWithCredentials } from '../hooks/useChannelConnections';
import { CredentialField } from './CredentialField';
import type { ConnectDialogProps } from './OAuthConnectDialog';

const FORM_ID = 'connect-credentials-form';
const NO_VALUES: CredentialValues = {};

/** Where the channel says to find the API details. */
function GuideLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium text-foreground underline"
    >
      {CREDENTIALS_DIALOG_COPY.guide}
      <ExternalLink className="size-3" aria-hidden="true" />
    </a>
  );
}

interface CredentialsFormProps {
  fields: CredentialsConnectableChannel['fields'];
  values: CredentialValues;
  onChange: (values: CredentialValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}

function CredentialsForm({ fields, values, onChange, onSubmit, disabled }: CredentialsFormProps) {
  return (
    <form id={FORM_ID} onSubmit={onSubmit}>
      <FieldGroup>
        {fields.map((field) => (
          <CredentialField
            key={field.key}
            field={field}
            value={values[field.key] ?? ''}
            onChange={(value) => onChange({ ...values, [field.key]: value })}
            disabled={disabled}
          />
        ))}
      </FieldGroup>
    </form>
  );
}

interface CredentialsDialogActionsProps {
  busy: boolean;
  ready: boolean;
  onCancel: () => void;
}

function CredentialsDialogActions({ busy, ready, onCancel }: CredentialsDialogActionsProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
      <Button type="submit" form={FORM_ID} disabled={busy || !ready}>
        {busy && <Spinner data-icon="inline-start" />}
        {CREDENTIALS_DIALOG_COPY.submit}
      </Button>
    </DialogFooter>
  );
}

/** Asks for the API details the channel issued, checks them with the channel and connects. */
export function CredentialsConnectDialog({
  workspaceId,
  channel,
  connect,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: ConnectDialogProps<CredentialsConnectableChannel>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const [values, setValues] = useState<CredentialValues>(NO_VALUES);
  const connectStore = useConnectWithCredentials(workspaceId);
  const isBusy = connectStore.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isBusy) return;
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setValues(NO_VALUES);
      connectStore.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const credentials = toSellerCredentials(values);
    if (credentials) connectStore.mutate({ channel: connect.type, credentials });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {channel.name}</DialogTitle>
          <DialogDescription>
            {CREDENTIALS_DIALOG_COPY.description} <GuideLink href={connect.guideUrl} />
          </DialogDescription>
        </DialogHeader>
        <FormError error={connectStore.error} />
        <CredentialsForm
          fields={connect.fields}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          disabled={isBusy}
        />
        <CredentialsDialogActions
          busy={isBusy}
          ready={isComplete(connect.fields, values)}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
