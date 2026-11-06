import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ConfirmTone } from '@/components/feedback/confirm-tone';
import {
  useDeleteWebhookEndpoint,
  useEditWebhookEndpoint,
  useRotateWebhookSecret,
  useSetWebhookEndpointEnabled,
  type WebhookEndpoint,
} from '../hooks/useWebhookEndpoints';
import { WEBHOOK_COPY } from '../webhooks.constants';
import { WebhookEndpointFormDialog } from './WebhookEndpointFormDialog';
import { WebhookSecretDialog } from './WebhookSecretDialog';

/** A dialog an endpoint's actions menu opens. */
export interface EndpointDialogProps {
  workspaceId: string;
  endpoint: WebhookEndpoint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function refOf({ workspaceId, endpoint }: Pick<EndpointDialogProps, 'workspaceId' | 'endpoint'>) {
  return { workspaceId, endpointId: endpoint.id };
}

export function EditEndpointDialog({ open, onOpenChange, ...target }: EndpointDialogProps) {
  const edit = useEditWebhookEndpoint(refOf(target));
  return (
    <WebhookEndpointFormDialog
      open={open}
      onOpenChange={(next) => {
        // A form reopened later starts without the last attempt's error.
        if (!next) edit.reset();
        onOpenChange(next);
      }}
      endpoint={target.endpoint}
      save={{
        submit: (body) => edit.mutate(body, { onSuccess: () => onOpenChange(false) }),
        error: edit.error,
        isPending: edit.isPending,
      }}
    />
  );
}

/** Confirms the rotation, then shows the new secret once. */
export function RotateSecretDialog({ open, onOpenChange, ...target }: EndpointDialogProps) {
  const rotate = useRotateWebhookSecret(refOf(target));
  return (
    <>
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title={WEBHOOK_COPY.rotateTitle}
        description={WEBHOOK_COPY.rotateDescription}
        confirmLabel={WEBHOOK_COPY.rotateConfirm}
        tone={ConfirmTone.Default}
        onConfirm={() => rotate.mutateAsync()}
      />
      <WebhookSecretDialog
        secret={rotate.data?.secret}
        url={target.endpoint.url}
        onDone={() => rotate.reset()}
      />
    </>
  );
}

/** Turning off fails what is still pending, so it asks first. */
export function TurnOffEndpointDialog({ open, onOpenChange, ...target }: EndpointDialogProps) {
  const setEnabled = useSetWebhookEndpointEnabled(refOf(target));
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={WEBHOOK_COPY.disableTitle}
      description={WEBHOOK_COPY.disableDescription}
      confirmLabel={WEBHOOK_COPY.disableConfirm}
      onConfirm={() => setEnabled.mutateAsync(false)}
    />
  );
}

interface DeleteEndpointDialogProps extends EndpointDialogProps {
  /** After the endpoint is gone, such as leaving its page. */
  onDeleted?: () => void;
}

export function DeleteEndpointDialog({
  open,
  onOpenChange,
  onDeleted,
  ...target
}: DeleteEndpointDialogProps) {
  const remove = useDeleteWebhookEndpoint(refOf(target));
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${target.endpoint.url}?`}
      description={WEBHOOK_COPY.deleteDescription}
      confirmLabel={WEBHOOK_COPY.deleteConfirm}
      onConfirm={async () => {
        await remove.mutateAsync();
        onDeleted?.();
      }}
    />
  );
}
