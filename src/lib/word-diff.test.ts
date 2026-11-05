import { DiffPart, diffWords } from './word-diff';

describe('diffWords', () => {
  it('keeps shared words and marks what was removed and added', () => {
    expect(diffWords('Blue mug', 'Blue stoneware mug, 350 ml')).toEqual([
      { part: DiffPart.Same, text: 'Blue ' },
      { part: DiffPart.Removed, text: 'mug' },
      { part: DiffPart.Added, text: 'stoneware mug, 350 ml' },
    ]);
  });

  it('reads an unchanged text as one kept run', () => {
    expect(diffWords('Same title', 'Same title')).toEqual([
      { part: DiffPart.Same, text: 'Same title' },
    ]);
  });

  it('handles an empty side', () => {
    expect(diffWords('', 'New')).toEqual([{ part: DiffPart.Added, text: 'New' }]);
    expect(diffWords('Old', '')).toEqual([{ part: DiffPart.Removed, text: 'Old' }]);
  });

  it('gives each text back when its runs are joined', () => {
    const before = 'Acme mug in blue, holds 350 ml';
    const after = 'Acme stoneware mug in blue, 350 ml';
    const segments = diffWords(before, after);
    const join = (part: DiffPart) =>
      segments
        .filter((segment) => segment.part !== part)
        .map((segment) => segment.text)
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
    expect(join(DiffPart.Added)).toBe(before);
    expect(join(DiffPart.Removed)).toBe(after);
  });
});
