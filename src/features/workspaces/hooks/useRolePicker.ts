import { useState } from 'react';
import type { WorkspaceRole } from '@/api/schema';
import { grantableOptions, type RoleOption, roleOptions } from '../role-options';
import type { Workspace } from './useCurrentWorkspace';
import { useRoleCatalog } from './useRoleCatalog';

interface RolePicker {
  /** The roles the user may give, minus `excluded`. */
  options: RoleOption[];
  /** The picked role, or the first one while the pick is not offered. */
  role: RoleOption | undefined;
  pick: (option: RoleOption) => void;
  reset: () => void;
}

/** State for choosing a role to give: only roles the user's permissions cover. */
export function useRolePicker(
  workspace: Workspace,
  initialValue: string,
  excluded: readonly WorkspaceRole[] = [],
): RolePicker {
  const [value, setValue] = useState(initialValue);
  const { data: catalog } = useRoleCatalog(workspace.id);
  const options = catalog
    ? grantableOptions(roleOptions(catalog), workspace.permissions).filter(
        (option) => !excluded.includes(option.assignment.role),
      )
    : [];
  return {
    options,
    role: options.find((option) => option.value === value) ?? options[0],
    pick: (option) => setValue(option.value),
    reset: () => setValue(initialValue),
  };
}
