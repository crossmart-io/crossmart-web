import { type PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { type SaveGroupMember, SaveGroupContext } from './save-group-context';
import { SaveGroupBar } from './SaveGroupBar';

/** What the bar shows: whether anything changed, and whether anything waits for a save. */
interface GroupState {
  dirty: string[];
  pending: string[];
}

const EMPTY_STATE: GroupState = { dirty: [], pending: [] };

function withMember(state: GroupState, id: string, member: SaveGroupMember | null): GroupState {
  const toggle = (ids: string[], on: boolean) => {
    const has = ids.includes(id);
    if (has === on) return ids;
    return on ? [...ids, id] : ids.filter((other) => other !== id);
  };
  const dirty = toggle(state.dirty, member?.dirty ?? false);
  const pending = toggle(state.pending, member ? member.dirty || member.pending : false);
  return dirty === state.dirty && pending === state.pending ? state : { dirty, pending };
}

/**
 * Several settings cards saved together from one floating bar, instead of a save button each.
 * Saving runs each waiting card's own save in turn; each card shows its own error.
 */
export function SaveGroupProvider({ children }: PropsWithChildren) {
  const members = useRef(new Map<string, SaveGroupMember>());
  const [state, setState] = useState(EMPTY_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const set = useCallback((id: string, member: SaveGroupMember) => {
    members.current.set(id, member);
    setState((current) => withMember(current, id, member));
  }, []);
  const remove = useCallback((id: string) => {
    members.current.delete(id);
    setState((current) => withMember(current, id, null));
  }, []);
  const registry = useMemo(() => ({ set, remove }), [set, remove]);

  async function saveAll(): Promise<void> {
    setIsSaving(true);
    for (const id of state.pending) await members.current.get(id)?.save();
    setIsSaving(false);
  }
  const discardAll = () => state.dirty.forEach((id) => members.current.get(id)?.discard());

  return (
    <SaveGroupContext.Provider value={registry}>
      {children}
      {state.pending.length > 0 && (
        <SaveGroupBar
          hasChanges={state.dirty.length > 0}
          isSaving={isSaving}
          onSave={() => void saveAll()}
          onDiscard={discardAll}
        />
      )}
    </SaveGroupContext.Provider>
  );
}
