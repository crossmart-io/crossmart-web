import { Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { SecretReveal } from '@/components/forms/SecretReveal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { roleLabel, useRolePicker, type Workspace } from '@/features/workspaces';
import { API_KEY_FEEDBACK, DEFAULT_KEY_ROLE, KEY_EXCLUDED_ROLES } from '../api-keys.constants';
import { type IssuedApiKey, useCreateApiKey } from '../hooks/useApiKeys';
import { ApiKeyFields } from './ApiKeyFields';

const FORM_ID = 'create-api-key-form';
const INTRO = 'For Claude, ChatGPT, your own agent or scripts. Send it in the x-api-key header.';

function describe(issued: IssuedApiKey | undefined): string {
  return issued ? `${issued.apiKey.name} can now act as ${roleLabel(issued.apiKey)}.` : INTRO;
}

export function CreateApiKeyDialog({ workspace }: { workspace: Workspace }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  // A key never gets Owner, nor more than its creator has.
  const picker = useRolePicker(workspace, DEFAULT_KEY_ROLE, KEY_EXCLUDED_ROLES);
  const { role } = picker;
  const createKey = useCreateApiKey(workspace.id);
  const issued = createKey.data;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setName('');
      picker.reset();
      createKey.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role) createKey.mutate({ name: name.trim(), ...role.assignment });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          Create key
        </Button>
      </DialogTrigger>
      <DialogContent
        // The secret is shown only once: while it is on screen, only Done closes the dialog.
        showCloseButton={!issued}
        onEscapeKeyDown={(event) => issued && event.preventDefault()}
        onInteractOutside={(event) => issued && event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{issued ? 'Your new API key' : 'Create an API key'}</DialogTitle>
          <DialogDescription>{describe(issued)}</DialogDescription>
        </DialogHeader>
        <FormError error={createKey.error} />
        {issued ? (
          <IssuedKeySecret secret={issued.secret} />
        ) : (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <ApiKeyFields name={name} onNameChange={setName} picker={picker} />
          </form>
        )}
        <DialogFooter>
          {issued ? (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          ) : (
            <SubmitKeyButton disabled={!name.trim() || !role} isPending={createKey.isPending} />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubmitKeyButton({ disabled, isPending }: { disabled: boolean; isPending: boolean }) {
  return (
    <Button type="submit" form={FORM_ID} disabled={disabled || isPending}>
      {isPending && <Spinner data-icon="inline-start" />}
      {isPending ? 'Creating…' : 'Create key'}
    </Button>
  );
}

/** The key, shown once, with a copy button. */
function IssuedKeySecret({ secret }: { secret: string }) {
  return (
    <SecretReveal secret={secret} copyLabel="Copy key" copiedMessage={API_KEY_FEEDBACK.copied}>
      <p>Copy it now. For your security it is stored only as a hash and cannot be shown again.</p>
    </SecretReveal>
  );
}
