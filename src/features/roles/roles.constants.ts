/** Toasts after role changes. */
export const ROLE_FEEDBACK = {
  created: 'Role created',
  updated: 'Role saved. It applies to everyone who has it.',
  deleted: 'Role deleted',
} as const;

export const ROLE_NAME_MAX_LENGTH = 60;
export const ROLE_DESCRIPTION_MAX_LENGTH = 200;
