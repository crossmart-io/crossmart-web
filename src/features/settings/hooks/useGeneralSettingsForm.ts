import { type FormEvent, useState } from 'react';
import type { components, OutsideAgentChanges } from '@/api/schema';
import { browserTimeZone, useUpdateWorkspace, type Workspace } from '@/features/workspaces';
import { SETTINGS_COPY } from '../settings.constants';

type WorkspaceChanges = components['schemas']['UpdateWorkspaceDto'];

export interface GeneralSettingsValues {
  name: string;
  timeZone: string;
  outsideAgentChanges: OutsideAgentChanges;
}

export function valuesOf(workspace: Workspace): GeneralSettingsValues {
  return {
    name: workspace.displayName,
    timeZone: workspace.timeZone ?? browserTimeZone(),
    outsideAgentChanges: workspace.outsideAgentChanges,
  };
}

/**
 * Only what differs from the form's starting values, so one save sends one change set. An
 * unset time zone starts on the browser's, which `useDefaultTimeZone` saves on its own.
 */
export function changedSettings(
  initial: GeneralSettingsValues,
  values: GeneralSettingsValues,
): WorkspaceChanges {
  const changes: WorkspaceChanges = {};
  const name = values.name.trim();
  if (name !== initial.name) changes.name = name;
  if (values.timeZone !== initial.timeZone) changes.timeZone = values.timeZone;
  if (values.outsideAgentChanges !== initial.outsideAgentChanges) {
    changes.outsideAgentChanges = values.outsideAgentChanges;
  }
  return changes;
}

/** The General tab's one form: name, time zone and outside agents' changes, saved together. */
export function useGeneralSettingsForm(workspace: Workspace) {
  const [values, setValues] = useState(() => valuesOf(workspace));
  const update = useUpdateWorkspace(workspace.id, SETTINGS_COPY.saved);
  const changes = changedSettings(valuesOf(workspace), values);
  const canSave =
    Object.keys(changes).length > 0 && values.name.trim().length > 0 && !update.isPending;

  const set = <Key extends keyof GeneralSettingsValues>(
    key: Key,
    value: GeneralSettingsValues[Key],
  ) => setValues((current) => ({ ...current, [key]: value }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) update.mutate(changes);
  }

  return { values, set, canSave, submit, isSaving: update.isPending, error: update.error };
}
