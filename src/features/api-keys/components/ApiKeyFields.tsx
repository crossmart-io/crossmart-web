import { WorkspaceRole } from '@/api/schema';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WORKSPACE_ROLE_DESCRIPTIONS, WORKSPACE_ROLE_LABELS } from '@/features/workspaces';
import { ASSIGNABLE_KEY_ROLES } from '../api-keys.constants';

const NAME_FIELD_ID = 'api-key-name';
const ROLE_FIELD_ID = 'api-key-role';

function isWorkspaceRole(value: string): value is WorkspaceRole {
  return Object.values<string>(WorkspaceRole).includes(value);
}

interface ApiKeyFieldsProps {
  name: string;
  onNameChange: (name: string) => void;
  role: WorkspaceRole;
  onRoleChange: (role: WorkspaceRole) => void;
}

export function ApiKeyFields({ name, onNameChange, role, onRoleChange }: ApiKeyFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={NAME_FIELD_ID}>Name</FieldLabel>
        <Input
          id={NAME_FIELD_ID}
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Claude Desktop"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={ROLE_FIELD_ID}>Access</FieldLabel>
        <Select
          value={role}
          onValueChange={(value) => isWorkspaceRole(value) && onRoleChange(value)}
        >
          <SelectTrigger id={ROLE_FIELD_ID} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASSIGNABLE_KEY_ROLES.map((keyRole) => (
              <SelectItem key={keyRole} value={keyRole}>
                {WORKSPACE_ROLE_LABELS[keyRole]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>{WORKSPACE_ROLE_DESCRIPTIONS[role]}</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
