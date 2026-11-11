import { hasMoreDetailsError, linksIntoMoreDetails } from './more-details';

describe('More details', () => {
  it('opens for an invalid field inside it, not for the price or quantity above it', () => {
    expect(hasMoreDetailsError({ variants: [{ price: { type: 'x', message: 'x' } }] })).toBe(false);
    expect(hasMoreDetailsError({ variants: [{ weightGrams: { type: 'x', message: 'x' } }] })).toBe(
      true,
    );
    expect(hasMoreDetailsError({ vendor: { type: 'x', message: 'x' } })).toBe(true);
  });

  it('opens for a link to its variants', () => {
    expect(linksIntoMoreDetails('#variants')).toBe(true);
    expect(linksIntoMoreDetails('#media')).toBe(false);
  });
});
