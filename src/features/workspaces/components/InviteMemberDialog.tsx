import { UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { WorkspaceRole } from '@/api/schema';
import { FormError } from '@/components/feedback/FormError';
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
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useInviteMember } from '../hooks/useInvitations';
import { useRolePicker } from '../hooks/useRolePicker';
import { RoleSelect } from './RoleSelect';

const FORM_ID = 'invite-member-form';
const EMAIL_FIELD_ID = 'invite-email';
const ROLE_FIELD_ID = 'invite-role';
const DEFAULT_INVITE_ROLE: string = WorkspaceRole.EDITOR;

export function InviteMemberDialog({ workspace }: { workspace: Workspace }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const picker = useRolePicker(workspace, DEFAULT_INVITE_ROLE);
  const { role } = picker;
  const invite = useInviteMember(workspace.id);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEmail('');
      picker.reset();
      invite.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) return;
    invite.mutate(
      { email: email.trim(), ...role.assignment },
      { onSuccess: () => handleOpenChange(false) },
    );
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
        <FormError error={invite.error} />
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <InviteFields email={email} onEmailChange={setEmail} picker={picker} />
        </form>
        <DialogFooter>
          <SendButton disabled={!email.trim() || !role} isPending={invite.isPending} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SendButton({ disabled, isPending }: { disabled: boolean; isPending: boolean }) {
  return (
    <Button type="submit" form={FORM_ID} disabled={disabled || isPending}>
      {isPending && <Spinner data-icon="inline-start" />}
      {isPending ? 'Sending…' : 'Send invitation'}
    </Button>
  );
}

interface InviteFieldsProps {
  email: string;
  onEmailChange: (email: string) => void;
  picker: ReturnType<typeof useRolePicker>;
}

function InviteFields({ email, onEmailChange, picker }: InviteFieldsProps) {
  const { role } = picker;
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
          value={role?.value ?? ''}
          options={picker.options}
          onChange={picker.pick}
          className="w-full"
        />
        {role && <FieldDescription>{role.description}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
}
