import { splitSummary } from './summary-parts';

describe('splitSummary', () => {
  it('marks quoted names as user content', () => {
    expect(splitSummary('Updated “צמיד כסף” in Shopify')).toEqual([
      { text: 'Updated “', isUserContent: false },
      { text: 'צמיד כסף', isUserContent: true },
      { text: '”', isUserContent: false },
      { text: ' in Shopify', isUserContent: false },
    ]);
  });

  it('handles several names', () => {
    const parts = splitSummary('Renamed the workspace from “A” to “B”');
    expect(parts.filter((part) => part.isUserContent).map((part) => part.text)).toEqual(['A', 'B']);
  });

  it('keeps a summary without names whole', () => {
    expect(splitSummary('Changed the time zone')).toEqual([
      { text: 'Changed the time zone', isUserContent: false },
    ]);
  });
});
