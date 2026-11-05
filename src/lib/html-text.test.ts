import { htmlToText } from './html-text';

describe('htmlToText', () => {
  it('keeps the text, one block per line', () => {
    expect(
      htmlToText(
        '<p>Hand-glazed <strong>stoneware</strong>.</p><ul><li>350 ml</li><li>Blue</li></ul>',
      ),
    ).toBe('Hand-glazed stoneware.\n350 ml\nBlue');
  });

  it('never runs scripts or keeps their markup', () => {
    expect(htmlToText('<p>Safe</p><img src=x onerror="alert(1)">')).toBe('Safe');
  });
});
