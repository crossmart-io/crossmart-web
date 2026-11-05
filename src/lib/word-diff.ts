/** Whether a piece of text is in both versions, only the old one, or only the new one. */
export enum DiffPart {
  Same = 'same',
  Removed = 'removed',
  Added = 'added',
}

export interface DiffSegment {
  part: DiffPart;
  text: string;
}

/** Words and the whitespace after them, so joining the tokens gives the text back. */
const WORD_WITH_SPACE = /\S+\s*|\s+/g;

function tokenize(text: string): string[] {
  return text.match(WORD_WITH_SPACE) ?? [];
}

/** Two token lists and, for every pair of suffixes, the length of their longest common run. */
class TokenTable {
  private readonly lengths: number[][];

  constructor(
    readonly before: readonly string[],
    readonly after: readonly string[],
  ) {
    this.lengths = Array.from({ length: before.length + 1 }, () =>
      Array.from({ length: after.length + 1 }, () => 0),
    );
    for (let row = before.length - 1; row >= 0; row -= 1) {
      for (let column = after.length - 1; column >= 0; column -= 1) {
        this.set(row, column, this.computed(row, column));
      }
    }
  }

  /** Whether the words at these positions are the same, whatever whitespace follows them. */
  matches(row: number, column: number): boolean {
    return (this.before[row] ?? '').trim() === (this.after[column] ?? '').trim();
  }

  /** The longest common run of the suffixes starting here. */
  common(row: number, column: number): number {
    return this.lengths[row]?.[column] ?? 0;
  }

  private computed(row: number, column: number): number {
    return this.matches(row, column)
      ? this.common(row + 1, column + 1) + 1
      : Math.max(this.common(row + 1, column), this.common(row, column + 1));
  }

  private set(row: number, column: number, value: number): void {
    const cells = this.lengths[row];
    if (cells) cells[column] = value;
  }
}

function push(segments: DiffSegment[], part: DiffPart, text = ''): void {
  const last = segments.at(-1);
  if (last?.part === part) last.text += text;
  else segments.push({ part, text });
}

/**
 * What changed between two texts, word by word, as runs of kept, removed and added words. Small
 * edits to a title or description then read as edits, not as a whole new text.
 */
export function diffWords(before: string, after: string): DiffSegment[] {
  const table = new TokenTable(tokenize(before), tokenize(after));
  const segments: DiffSegment[] = [];
  let row = 0;
  let column = 0;
  while (row < table.before.length && column < table.after.length) {
    if (table.matches(row, column)) {
      push(segments, DiffPart.Same, table.after[column]);
      row += 1;
      column += 1;
    } else if (table.common(row + 1, column) >= table.common(row, column + 1)) {
      push(segments, DiffPart.Removed, table.before[row]);
      row += 1;
    } else {
      push(segments, DiffPart.Added, table.after[column]);
      column += 1;
    }
  }
  table.before.slice(row).forEach((token) => push(segments, DiffPart.Removed, token));
  table.after.slice(column).forEach((token) => push(segments, DiffPart.Added, token));
  return segments;
}
