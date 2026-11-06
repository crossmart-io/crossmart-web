import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useSendWebhookTest,
  useSetWebhookEndpointEnabled,
  type WebhookEndpoint,
} from '../hooks/useWebhookEndpoints';
import {
  DeleteEndpointDialog,
  EditEndpointDialog,
  RotateSecretDialog,
  TurnOffEndpointDialog,
} from './EndpointDialogs';

/** The dialogs the menu opens; one at a time. */
enum EndpointDialog {
  Edit = 'edit',
  RotateSecret = 'rotate_secret',
  TurnOff = 'turn_off',
  Delete = 'delete',
}

interface EndpointActionsMenuProps {
  workspaceId: string;
  endpoint: WebhookEndpoint;
  onDeleted?: () => void;
}

/** Everything that can be done to an endpoint: test, edit, rotate, turn on or off, delete. */
export function EndpointActionsMenu({
  workspaceId,
  endpoint,
  onDeleted,
}: EndpointActionsMenuProps) {
  const ref = { workspaceId, endpointId: endpoint.id };
  const [dialog, setDialog] = useState<EndpointDialog>();
  const sendTest = useSendWebhookTest(ref);
  const setEnabled = useSetWebhookEndpointEnabled(ref);
  const dialogProps = (kind: EndpointDialog) => ({
    workspaceId,
    endpoint,
    open: dialog === kind,
    onOpenChange: (open: boolean) => setDialog(open ? kind : undefined),
  });

  return (
    <>
      {/* Not modal, so a dialog opened from an item gets the focus when the menu closes. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${endpoint.url}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onSelect={() => sendTest.mutate()}>Send test event</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog(EndpointDialog.Edit)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog(EndpointDialog.RotateSecret)}>
            Rotate secret
          </DropdownMenuItem>
          {endpoint.enabled ? (
            <DropdownMenuItem onSelect={() => setDialog(EndpointDialog.TurnOff)}>
              Turn off
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => setEnabled.mutate(true)}>Turn on</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDialog(EndpointDialog.Delete)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditEndpointDialog {...dialogProps(EndpointDialog.Edit)} />
      <RotateSecretDialog {...dialogProps(EndpointDialog.RotateSecret)} />
      <TurnOffEndpointDialog {...dialogProps(EndpointDialog.TurnOff)} />
      <DeleteEndpointDialog {...dialogProps(EndpointDialog.Delete)} onDeleted={onDeleted} />
    </>
  );
}
