import { type ConnectableChannel, ConnectMethod } from '../channels.constants';
import { CredentialsConnectDialog } from './CredentialsConnectDialog';
import { type ConnectDialogProps, OAuthConnectDialog } from './OAuthConnectDialog';

/** Connects a store the way its channel takes: approving Crossmart, or pasting API details. */
export function ConnectChannelDialog({
  connect,
  ...props
}: ConnectDialogProps<ConnectableChannel>) {
  return connect.method === ConnectMethod.Credentials ? (
    <CredentialsConnectDialog connect={connect} {...props} />
  ) : (
    <OAuthConnectDialog connect={connect} {...props} />
  );
}
