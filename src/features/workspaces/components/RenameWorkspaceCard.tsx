import { type FormEvent, useState } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useRenameWorkspace } from '../hooks/useWorkspaceMutations';
import { WORKSPACE_NAME_MAX_LENGTH } from '../workspaces.constants';

const NAME_FIELD_ID = 'rename-workspace';

export function RenameWorkspaceCard({ workspace }: { workspace: Workspace }) {
  const [name, setName] = useState(workspace.displayName);
  const rename = useRenameWorkspace(workspace.id);
  const unchanged = name.trim() === workspace.displayName;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    rename.mutate(name.trim());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Name</CardTitle>
        <CardDescription>
          What everyone here sees in the workspace menu. The catalog currency is{' '}
          {workspace.currency} and cannot change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError error={rename.error} />
          <Field>
            <FieldLabel htmlFor={NAME_FIELD_ID}>Workspace name</FieldLabel>
            <Input
              id={NAME_FIELD_ID}
              value={name}
              maxLength={WORKSPACE_NAME_MAX_LENGTH}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
          <Button
            type="submit"
            className="self-start"
            disabled={!name.trim() || unchanged || rename.isPending}
          >
            {rename.isPending && <Spinner data-icon="inline-start" />}
            Save name
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
