import { useContext, useEffect, useId } from 'react';
import { type SaveGroupMember, SaveGroupContext } from './save-group-context';

/**
 * Joins the surrounding save group, if there is one, so its one bar saves this card too.
 * Returns whether the card is in a group, and so should not show its own save button.
 */
export function useSaveGroupMember(member: SaveGroupMember): boolean {
  const group = useContext(SaveGroupContext);
  const id = useId();
  // Runs after every render: the group keeps the latest save and discard, and re-renders
  // only when the card's state changed.
  useEffect(() => {
    group?.set(id, member);
  });
  useEffect(() => () => group?.remove(id), [group, id]);
  return group !== null;
}
