import '@tanstack/react-query';

/**
 * What a mutation tells the user. The query client turns it into toasts.
 * A type, not an interface: TanStack only accepts meta assignable to `Record<string, unknown>`.
 */
type MutationFeedback = {
  /** Toast shown when the mutation succeeds. */
  successMessage?: string;
  /** The screen shows the error itself, so no toast. */
  inlineError?: boolean;
};

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: MutationFeedback;
  }
}
