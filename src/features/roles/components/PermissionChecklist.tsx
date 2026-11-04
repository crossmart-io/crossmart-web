import type { WorkspacePermission } from '@/api/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field';
import { ALWAYS_GRANTED_PERMISSION, PERMISSION_GROUPS } from '@/features/workspaces';

interface PermissionChecklistProps {
  value: readonly WorkspacePermission[];
  onChange: (permissions: WorkspacePermission[]) => void;
  /** What the user has; a role can hold nothing more, so the rest is shown but locked. */
  available: readonly WorkspacePermission[];
}

/** Every permission a role can hold, by area. Opening the workspace is always on. */
export function PermissionChecklist({ value, onChange, available }: PermissionChecklistProps) {
  function toggle(permission: WorkspacePermission, checked: boolean) {
    onChange(
      checked ? [...value, permission] : value.filter((existing) => existing !== permission),
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {PERMISSION_GROUPS.map((group) => (
        <fieldset key={group.label} className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">{group.label}</legend>
          {group.permissions.map(({ permission, label }) => {
            const id = `permission-${permission}`;
            const fixed = permission === ALWAYS_GRANTED_PERMISSION;
            const locked = fixed || !available.includes(permission);
            return (
              <div key={permission} className="flex items-start gap-2">
                <Checkbox
                  id={id}
                  checked={fixed || value.includes(permission)}
                  disabled={locked}
                  onCheckedChange={(checked) => toggle(permission, checked === true)}
                />
                <FieldLabel htmlFor={id} className="font-normal leading-tight">
                  {label}
                </FieldLabel>
              </div>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
