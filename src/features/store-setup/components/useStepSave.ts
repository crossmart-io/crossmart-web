import { type RefObject, useEffect } from 'react';
import type { SaveStep } from '../hooks/useStoreSetupSave';

/** Hands the step's latest save to the dialog, and takes it back when the step goes away. */
export function useStepSave(stepRef: RefObject<SaveStep | null>, save: SaveStep): void {
  useEffect(() => {
    stepRef.current = save;
  });
  useEffect(
    () => () => {
      stepRef.current = null;
    },
    [stepRef],
  );
}
