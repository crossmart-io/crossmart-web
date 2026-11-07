/** Answers every media query with `matches`, as jsdom has no media queries of its own. */
export function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn<(query: string) => MediaQueryList>(
      (query) =>
        ({
          matches,
          media: query,
          addEventListener: vi.fn<() => void>(),
          removeEventListener: vi.fn<() => void>(),
        }) as unknown as MediaQueryList,
    ),
  );
}
