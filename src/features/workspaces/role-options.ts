import { type components, type WorkspacePermission, WorkspaceRole } from '@/api/schema';
import { WORKSPACE_ROLE_DESCRIPTIONS, WORKSPACE_ROLE_LABELS } from './workspace-role';

export type RoleCatalog = components['schemas']['RoleCatalogDto'];
export type CustomRole = components['schemas']['CustomRoleDto'];
type CustomRoleRef = components['schemas']['CustomRoleRefDto'];

/** A role as a member, invitation or key holds it. */
interface HeldRole {
  role: WorkspaceRole;
  customRole: CustomRoleRef | null;
}

/** What the API takes to grant a role. */
export interface RoleAssignment {
  role: WorkspaceRole;
  customRoleId?: string;
}

/** One entry of a role picker. */
export interface RoleOption {
  /** Unique among built-in and custom roles, for select values. */
  value: string;
  assignment: RoleAssignment;
  label: string;
  description: string;
  permissions: readonly WorkspacePermission[];
}

const CUSTOM_VALUE_PREFIX = 'custom:';

function countOfPermissions(count: number): string {
  return `${count} ${count === 1 ? 'permission' : 'permissions'}`;
}

/** The picker value of a role someone holds. */
export function roleValue(held: HeldRole): string {
  return held.customRole ? `${CUSTOM_VALUE_PREFIX}${held.customRole.id}` : held.role;
}

/** A role as people read it: the custom role's name, or the built-in role's. */
export function roleLabel(held: HeldRole): string {
  return held.customRole?.name ?? WORKSPACE_ROLE_LABELS[held.role];
}

/** Built-in roles first, most access first, then the workspace's own by name. */
export function roleOptions(catalog: RoleCatalog): RoleOption[] {
  const builtIn = catalog.builtIn.map(({ role, permissions }) => ({
    value: role,
    assignment: { role },
    label: WORKSPACE_ROLE_LABELS[role],
    description: WORKSPACE_ROLE_DESCRIPTIONS[role],
    permissions,
  }));
  const custom = catalog.custom.map((customRole) => ({
    value: `${CUSTOM_VALUE_PREFIX}${customRole.id}`,
    assignment: { role: WorkspaceRole.CUSTOM, customRoleId: customRole.id },
    label: customRole.name,
    description: customRole.description ?? countOfPermissions(customRole.permissions.length),
    permissions: customRole.permissions,
  }));
  return [...builtIn, ...custom];
}

/** True when `holder` has every permission of `option`, so granting it is no escalation. */
export function covers(holder: readonly WorkspacePermission[], option: RoleOption): boolean {
  return option.permissions.every((permission) => holder.includes(permission));
}

/** The options someone with `permissions` may grant, the same rule the API applies. */
export function grantableOptions(
  options: readonly RoleOption[],
  permissions: readonly WorkspacePermission[],
): RoleOption[] {
  return options.filter((option) => covers(permissions, option));
}
