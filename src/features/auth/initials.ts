const MAX_INITIALS = 2;

/** "Ada Lovelace" → "AL", "ada@example.com" → "A". */
export function toInitials(displayName: string): string {
  const [beforeAt = ''] = displayName.split('@');
  return beforeAt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
