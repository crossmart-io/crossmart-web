import { type FormEvent, useEffect, useState } from 'react';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type Workspace, useMe } from '@/features/workspaces';
import { WORKSPACE_INPUT_ID_PREFIX } from '../agents.constants';
import { usePickAgentWorkspace } from '../hooks/useAgentAuthorization';

/**
 * Where the agent will work. With one workspace there is nothing to choose, so it is picked
 * straight away; merchants never see the workspace concept otherwise.
 */
export function AgentWorkspacePicker() {
  const { data: me, isPending, error, refetch } = useMe();
  const pick = usePickAgentWorkspace();
  const workspaces = me?.workspaces ?? [];
  const [onlyWorkspace] = workspaces.length === 1 ? workspaces : [];

  useEffect(() => {
    if (onlyWorkspace && pick.isIdle) pick.mutate(onlyWorkspace.id);
  }, [onlyWorkspace, pick]);

  if (error) {
    return (
      <ErrorState title="Your workspaces could not be loaded" error={error} onRetry={refetch} />
    );
  }
  if (isPending || (onlyWorkspace && !pick.isError)) return <ContentLoader />;
  return (
    <WorkspaceChoice
      workspaces={workspaces}
      error={pick.error}
      isPending={pick.isPending}
      onPick={(workspaceId) => pick.mutate(workspaceId)}
    />
  );
}

interface WorkspaceChoiceProps {
  workspaces: readonly Workspace[];
  error: Error | null;
  isPending: boolean;
  onPick: (workspaceId: string) => void;
}

function WorkspaceChoice({ workspaces, error, isPending, onPick }: WorkspaceChoiceProps) {
  const [selected, setSelected] = useState(workspaces[0]?.id ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected) onPick(selected);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FormError error={error} />
        <FieldSet>
          <FieldLegend variant="label">Workspace</FieldLegend>
          <RadioGroup value={selected} onValueChange={setSelected}>
            {workspaces.map((workspace) => (
              <FieldLabel
                key={workspace.id}
                htmlFor={`${WORKSPACE_INPUT_ID_PREFIX}${workspace.id}`}
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{workspace.displayName}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value={workspace.id}
                    id={`${WORKSPACE_INPUT_ID_PREFIX}${workspace.id}`}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
        <Button type="submit" disabled={!selected || isPending}>
          {isPending ? 'Continuing…' : 'Continue'}
        </Button>
      </FieldGroup>
    </form>
  );
}
