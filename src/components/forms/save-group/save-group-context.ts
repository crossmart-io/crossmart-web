import { createContext } from 'react';

/** What one card in a save group tells the group, and how the group saves or resets it. */
export interface SaveGroupMember {
  /** Changed since it was last saved. */
  dirty: boolean;
  /** Waits for a save even unchanged, such as a setup that was never saved. */
  pending: boolean;
  save: () => Promise<void>;
  discard: () => void;
}

export interface SaveGroupRegistry {
  set: (id: string, member: SaveGroupMember) => void;
  remove: (id: string) => void;
}

/** Present inside a `SaveGroupProvider`; null elsewhere, where each card saves on its own. */
export const SaveGroupContext = createContext<SaveGroupRegistry | null>(null);
