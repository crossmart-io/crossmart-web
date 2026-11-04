import { htmlToText } from './html-to-text';

describe('htmlToText', () => {
  it('keeps the words and drops the markup', () => {
    expect(htmlToText('<p>Soft <b>merino</b></p><ul><li>Regular fit</li></ul>')).toBe(
      'Soft merino Regular fit',
    );
  });

  it('never returns script content as markup', () => {
    expect(htmlToText('<img src=x onerror="alert(1)">Hi')).toBe('Hi');
  });
});
