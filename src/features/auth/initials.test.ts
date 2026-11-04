import { toInitials } from './initials';

describe('toInitials', () => {
  it('takes the first letters of the first two words', () => {
    expect(toInitials('ada byron lovelace')).toBe('AB');
  });

  it('uses the part before the @ of an email', () => {
    expect(toInitials('ada@example.com')).toBe('A');
  });

  it('is empty for blank input', () => {
    expect(toInitials('   ')).toBe('');
  });
});
