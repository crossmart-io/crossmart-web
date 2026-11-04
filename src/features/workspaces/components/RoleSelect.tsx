import type { WorkspaceRole } from '@/api/schema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isWorkspaceRole, WORKSPACE_ROLE_LABELS } from '../workspace-role';

interface RoleSelectProps {
  value: WorkspaceRole;
  roles: readonly WorkspaceRole[];
  onChange: (role: WorkspaceRole) => void;
  id?: string;
  /** For a select without a visible label, such as one in a table row. */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({
  value,
  roles,
  onChange,
  id,
  ariaLabel,
  disabled,
  className,
}: RoleSelectProps) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => isWorkspaceRole(next) && onChange(next)}
    >
      <SelectTrigger id={id} aria-label={ariaLabel} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {WORKSPACE_ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
