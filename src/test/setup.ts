import '@testing-library/jest-dom/vitest';

/** jsdom has no layout, so no ResizeObserver; components that measure themselves need a stub. */
class NoopResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= NoopResizeObserver;
