import { type RefObject, useRef, useState } from 'react';
import type { ChannelConnection } from '@/features/channels';
import { useUpdateSelection } from '@/features/listings/hooks/useConnectionRules';
import { activeProductsRule } from '../just-connected';

/** The channel's own step saves itself and says whether it worked. */
export type SaveStep = () => Promise<boolean>;

interface StoreSetupSave {
  /** The channel's step puts its save here; null when the channel needs nothing. */
  stepRef: RefObject<SaveStep | null>;
  addActive: boolean;
  setAddActive: (next: boolean) => void;
  isSaving: boolean;
  selectionError: Error | null;
  /** Saves the step, then the rule; resolves to whether everything was saved. */
  save: () => Promise<boolean>;
}

/** Saves the setup in one go: the channel's settings first, then the automatic rule. */
export function useStoreSetupSave(
  workspaceId: string,
  connection: ChannelConnection,
): StoreSetupSave {
  const stepRef = useRef<SaveStep | null>(null);
  const [addActive, setAddActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const selection = useUpdateSelection({ workspaceId, connectionId: connection.id });

  async function saveRule(): Promise<boolean> {
    if (!addActive) return true;
    try {
      await selection.mutateAsync(activeProductsRule(connection.productSelection));
      return true;
    } catch {
      return false;
    }
  }

  async function save(): Promise<boolean> {
    setIsSaving(true);
    const stepSaved = stepRef.current ? await stepRef.current() : true;
    const saved = stepSaved && (await saveRule());
    setIsSaving(false);
    return saved;
  }

  return { stepRef, addActive, setAddActive, isSaving, selectionError: selection.error, save };
}
