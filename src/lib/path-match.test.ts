import { isPathWithin } from './path-match';

describe('isPathWithin', () => {
  it.each([
    ['/agent', '/agent'],
    ['/agent/review', '/agent'],
    ['/products/p-1', '/products'],
    ['/settings/team/roles', '/settings'],
  ])('puts %s under %s', (pathname, base) => {
    expect(isPathWithin(pathname, base)).toBe(true);
  });

  it.each([
    ['/agent-proposals', '/agent'],
    ['/stores-old', '/stores'],
    ['/products', '/products/stock'],
  ])('keeps %s out of %s', (pathname, base) => {
    expect(isPathWithin(pathname, base)).toBe(false);
  });

  it('matches only the path itself when exact', () => {
    expect(isPathWithin('/', '/', true)).toBe(true);
    expect(isPathWithin('/products', '/', true)).toBe(false);
  });
});
