import { chunk } from './chunk';

describe('chunk', () => {
  it('splits a list into pieces of at most the size, in order', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 2)).toEqual([]);
  });
});
