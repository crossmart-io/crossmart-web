/** Splits a list into consecutive pieces of at most `size`, such as batches an API accepts. */
export function chunk<Item>(items: readonly Item[], size: number): Item[][] {
  const pieces: Item[][] = [];
  for (let start = 0; start < items.length; start += size) {
    pieces.push(items.slice(start, start + size));
  }
  return pieces;
}
