import type { NavItem } from '@/config/navigation';
import { isPathWithin } from '@/lib/path-match';

/** Whether the page is the item's, or a page under it or one of the sections it holds. */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (isPathWithin(pathname, item.to, item.end)) return true;
  return (item.also ?? []).some((section) => isPathWithin(pathname, section));
}
