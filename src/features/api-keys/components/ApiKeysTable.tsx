import { KeyRound } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WORKSPACE_ROLE_LABELS } from '@/features/workspaces';
import { type ApiKey, useApiKeys, useRevokeApiKey } from '../hooks/useApiKeys';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

function formatDate(value: string | null | undefined, fallback: string): string {
  return value ? DATE_FORMAT.format(new Date(value)) : fallback;
}

export function ApiKeysTable({ workspaceId }: { workspaceId: string }) {
  const { data: apiKeys = [], isPending } = useApiKeys(workspaceId);

  if (!isPending && apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-12 text-center">
        <KeyRound className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">No API keys yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create a key to let an AI agent or a script read and edit your catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="hidden md:table-cell">Last used</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-medium">{apiKey.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {apiKey.prefix}…
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{WORKSPACE_ROLE_LABELS[apiKey.role]}</Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatDate(apiKey.lastUsedAt, 'Never')}
              </TableCell>
              <TableCell className="text-right">
                <RevokeButton workspaceId={workspaceId} apiKey={apiKey} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RevokeButton({ workspaceId, apiKey }: { workspaceId: string; apiKey: ApiKey }) {
  const revoke = useRevokeApiKey(workspaceId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke {apiKey.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Anything using this key stops working right away. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => revoke.mutate(apiKey.id)}>
            Revoke key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
