import { CircleAlert, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { WorkspaceRole } from '@/api/schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { WORKSPACE_ROLE_LABELS } from '@/features/workspaces';
import { DEFAULT_KEY_ROLE } from '../api-keys.constants';
import { type IssuedApiKey, useCreateApiKey } from '../hooks/useApiKeys';
import { ApiKeyFields } from './ApiKeyFields';
import { SecretReveal } from './SecretReveal';

const FORM_ID = 'create-api-key-form';
const INTRO = 'For Claude, ChatGPT, your own agent or scripts. Send it in the x-api-key header.';

function describe(issued: IssuedApiKey | undefined): string {
  return issued
    ? `${issued.apiKey.name} can now act as ${WORKSPACE_ROLE_LABELS[issued.apiKey.role]}.`
    : INTRO;
}

export function CreateApiKeyDialog({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<WorkspaceRole>(DEFAULT_KEY_ROLE);
  const createKey = useCreateApiKey(workspaceId);
  const issued = createKey.data;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setName('');
      setRole(DEFAULT_KEY_ROLE);
      createKey.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createKey.mutate({ name: name.trim(), role });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{issued ? 'Your new API key' : 'Create an API key'}</DialogTitle>
          <DialogDescription>{describe(issued)}</DialogDescription>
        </DialogHeader>
        {createKey.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{createKey.error.message}</AlertDescription>
          </Alert>
        )}
        {issued ? (
          <SecretReveal secret={issued.secret} />
        ) : (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <ApiKeyFields name={name} onNameChange={setName} role={role} onRoleChange={setRole} />
          </form>
        )}
        <DialogFooter>
          {issued ? (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          ) : (
            <Button type="submit" form={FORM_ID} disabled={!name.trim() || createKey.isPending}>
              {createKey.isPending ? 'Creating…' : 'Create key'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
