import { NAV_ITEMS } from '@/config/navigation';
import { isNavItemActive } from './nav-active';

/** The labels of the items the sidebar highlights on `pathname`. */
function activeLabels(pathname: string): string[] {
  return NAV_ITEMS.filter((item) => isNavItemActive(pathname, item)).map((item) => item.label);
}

describe('isNavItemActive', () => {
  it.each([
    ['/', 'Home'],
    ['/activity', 'Home'],
    ['/products/p-1', 'Products'],
    ['/products/stock', 'Products'],
    ['/imports/job-1', 'Products'],
    ['/stores/c-1/settings', 'Stores'],
    ['/agent', 'Agent'],
    ['/agent/review', 'Agent'],
    ['/settings/team/roles', 'Settings'],
  ])('highlights only one item on %s: %s', (pathname, label) => {
    expect(activeLabels(pathname)).toEqual([label]);
  });

  it('matches whole path segments, not prefixes', () => {
    expect(activeLabels('/agent-proposals')).toEqual([]);
    expect(activeLabels('/storesfront')).toEqual([]);
  });
});
