import { Trash2 } from 'lucide-react';
import { useId, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteWorkspace } from '../hooks/useDeletion';

interface DeleteWorkspaceCardProps {
  workspaceId: string;
  workspaceName: string;
}

/** Deletes the workspace once the owner types its name: it cannot be undone. */
export function DeleteWorkspaceCard({ workspaceId, workspaceName }: DeleteWorkspaceCardProps) {
  const inputId = useId();
  const [typed, setTyped] = useState('');
  const remove = useDeleteWorkspace(workspaceId);
  const matches = typed.trim() === workspaceName.trim();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete this workspace</CardTitle>
        <CardDescription>
          Disconnects every store and removes Crossmart from it, then deletes all products, stock,
          listings, orders, activity and API keys. Your products stay in your stores. This cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor={inputId}>Type “{workspaceName}” to confirm</FieldLabel>
          <Input
            id={inputId}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
          />
          <FieldDescription>
            You continue in your other workspace, or in a new, empty one if this is your only one.
          </FieldDescription>
        </Field>
        {remove.error && (
          <Alert variant="destructive">
            <AlertDescription>{remove.error.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="button"
          variant="destructive"
          className="self-start"
          disabled={!matches || remove.isPending}
          onClick={() => remove.mutate(typed)}
        >
          {remove.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Trash2 data-icon="inline-start" />
          )}
          Delete workspace
        </Button>
      </CardContent>
    </Card>
  );
}
