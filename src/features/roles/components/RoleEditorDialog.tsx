import { type FormEvent, type ReactNode, useState } from 'react';
import type { WorkspacePermission } from '@/api/schema';
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import type { CustomRole, Workspace } from '@/features/workspaces';
import { type RoleInput, useSaveRole } from '../hooks/useRoleMutations';
import { ROLE_DESCRIPTION_MAX_LENGTH, ROLE_NAME_MAX_LENGTH } from '../roles.constants';
import { PermissionChecklist } from './PermissionChecklist';

const FORM_ID = 'role-editor-form';
const NAME_FIELD_ID = 'role-name';
const DESCRIPTION_FIELD_ID = 'role-description';

interface RoleEditorDialogProps {
  workspace: Workspace;
  /** The role to change; a new one is created without it. */
  role?: CustomRole;
  trigger: ReactNode;
}

interface RoleDraft {
  name: string;
  description: string;
  permissions: WorkspacePermission[];
}

function draftOf(role?: CustomRole): RoleDraft {
  return {
    name: role?.name ?? '',
    description: role?.description ?? '',
    permissions: role?.permissions ?? [],
  };
}

function toInput(draft: RoleDraft): RoleInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim() || null,
    permissions: draft.permissions,
  };
}

export function RoleEditorDialog({ workspace, role, trigger }: RoleEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => draftOf(role));
  const save = useSaveRole(workspace.id, role?.id);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraft(draftOf(role));
      save.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save.mutate(toInput(draft), { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? `Edit ${role.name}` : 'Create a role'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Changes apply to everyone with this role right away.'
              : 'Pick what people with this role can do. You can give only what you can do yourself.'}
          </DialogDescription>
        </DialogHeader>
        <FormError error={save.error} />
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <RoleFields draft={draft} onChange={setDraft} available={workspace.permissions} />
        </form>
        <DialogFooter>
          <Button type="submit" form={FORM_ID} disabled={!draft.name.trim() || save.isPending}>
            {save.isPending && <Spinner data-icon="inline-start" />}
            {role ? 'Save role' : 'Create role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RoleFieldsProps {
  draft: RoleDraft;
  onChange: (draft: RoleDraft) => void;
  available: readonly WorkspacePermission[];
}

function RoleFields({ draft, onChange, available }: RoleFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={NAME_FIELD_ID}>Name</FieldLabel>
        <Input
          id={NAME_FIELD_ID}
          value={draft.name}
          maxLength={ROLE_NAME_MAX_LENGTH}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          placeholder="Stock clerk"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={DESCRIPTION_FIELD_ID}>Description (optional)</FieldLabel>
        <Input
          id={DESCRIPTION_FIELD_ID}
          value={draft.description}
          maxLength={ROLE_DESCRIPTION_MAX_LENGTH}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
          placeholder="Counts and adjusts stock, nothing else"
        />
      </Field>
      <PermissionChecklist
        value={draft.permissions}
        onChange={(permissions) => onChange({ ...draft, permissions })}
        available={available}
      />
    </FieldGroup>
  );
}
