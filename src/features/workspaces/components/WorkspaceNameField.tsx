import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { WORKSPACE_NAME_MAX_LENGTH } from '../workspaces.constants';

const FIELD_ID = 'workspace-name';

interface WorkspaceNameFieldProps {
  label: string;
  value: string;
  onChange: (name: string) => void;
  description?: string;
}

/** The workspace's name, as everyone in it sees it in the workspace menu. */
export function WorkspaceNameField({
  label,
  value,
  onChange,
  description,
}: WorkspaceNameFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={FIELD_ID}>{label}</FieldLabel>
      <Input
        id={FIELD_ID}
        value={value}
        maxLength={WORKSPACE_NAME_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        required
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
