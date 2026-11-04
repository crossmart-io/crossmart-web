import { CircleAlert, UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { WorkspaceRole } from '@/api/schema';
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useInviteMember } from '../hooks/useInvitations';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { grantableRoles, WORKSPACE_ROLE_DESCRIPTIONS } from '../workspace-role';
import { RoleSelect } from './RoleSelect';

const FORM_ID = 'invite-member-form';
const EMAIL_FIELD_ID = 'invite-email';
const ROLE_FIELD_ID = 'invite-role';
const DEFAULT_INVITE_ROLE = WorkspaceRole.EDITOR;

export function InviteMemberDialog({ workspace }: { workspace: Workspace }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>(DEFAULT_INVITE_ROLE);
  const invite = useInviteMember(workspace.id);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEmail('');
      setRole(DEFAULT_INVITE_ROLE);
      invite.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    invite.mutate({ email: email.trim(), role }, { onSuccess: () => handleOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus data-icon="inline-start" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite someone</DialogTitle>
          <DialogDescription>
            We email them a link to join {workspace.displayName}. It works for 7 days.
          </DialogDescription>
        </DialogHeader>
        {invite.error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{invite.error.message}</AlertDescription>
          </Alert>
        )}
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <InviteFields
            email={email}
            onEmailChange={setEmail}
            role={role}
            onRoleChange={setRole}
            roles={grantableRoles(workspace.role)}
          />
        </form>
        <DialogFooter>
          <Button type="submit" form={FORM_ID} disabled={!email.trim() || invite.isPending}>
            {invite.isPending && <Spinner data-icon="inline-start" />}
            {invite.isPending ? 'Sending…' : 'Send invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface InviteFieldsProps {
  email: string;
  onEmailChange: (email: string) => void;
  role: WorkspaceRole;
  onRoleChange: (role: WorkspaceRole) => void;
  roles: readonly WorkspaceRole[];
}

function InviteFields({ email, onEmailChange, role, onRoleChange, roles }: InviteFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={EMAIL_FIELD_ID}>Email</FieldLabel>
        <Input
          id={EMAIL_FIELD_ID}
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="dana@example.com"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={ROLE_FIELD_ID}>Role</FieldLabel>
        <RoleSelect
          id={ROLE_FIELD_ID}
          value={role}
          roles={roles}
          onChange={onRoleChange}
          className="w-full"
        />
        <FieldDescription>{WORKSPACE_ROLE_DESCRIPTIONS[role]}</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
