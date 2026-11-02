import type { AuthField } from './auth.constants';

/** Reads a text field from a submitted auth form. */
export function readAuthField(form: FormData, field: AuthField): string {
  const value = form.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

/** Passwords are read as typed: leading or trailing spaces are part of them. */
export function readPassword(form: FormData, field: AuthField): string {
  const value = form.get(field);
  return typeof value === 'string' ? value : '';
}
