import { Bot } from 'lucide-react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { asksToWrite } from '../agent-authorization';
import {
  type AgentConnection,
  useAgentConnections,
  useDisconnectAgent,
} from '../hooks/useAgentConnections';

export function AgentConnectionsTable({ workspaceId }: { workspaceId: string }) {
  const { data: connections, isPending, error, refetch } = useAgentConnections(workspaceId);

  if (error) {
    return (
      <ErrorState title="Connected agents could not be loaded" error={error} onRetry={refetch} />
    );
  }
  if (isPending) return <Skeleton className="h-32 w-full" />;
  if (connections.length === 0) return <NoAgents />;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="hidden md:table-cell">Connected by</TableHead>
            <TableHead className="hidden md:table-cell">Connected</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection.id}>
              <TableCell className="font-medium">{connection.clientName}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {asksToWrite(connection.scopes) ? 'Read and change' : 'Read only'}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {connection.userName}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatDate(connection.connectedAt)}
              </TableCell>
              <TableCell className="text-right">
                <DisconnectButton workspaceId={workspaceId} connection={connection} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NoAgents() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bot />
        </EmptyMedia>
        <EmptyTitle>No agents connected</EmptyTitle>
        <EmptyDescription>
          Add Crossmart as a connector in Claude, ChatGPT or another AI assistant and sign in. It
          shows up here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

interface DisconnectButtonProps {
  workspaceId: string;
  connection: AgentConnection;
}

function DisconnectButton({ workspaceId, connection }: DisconnectButtonProps) {
  const disconnect = useDisconnectAgent(workspaceId);
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" size="sm" aria-label={`Disconnect ${connection.clientName}`}>
          Disconnect
        </Button>
      }
      title={`Disconnect ${connection.clientName}?`}
      description="It stops working with this workspace right away. To use it again, connect it again from the agent."
      confirmLabel="Disconnect"
      onConfirm={() => disconnect.mutateAsync(connection.id)}
    />
  );
}
