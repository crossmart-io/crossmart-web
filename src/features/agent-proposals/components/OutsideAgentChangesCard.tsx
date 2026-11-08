import { type FormEvent, useState } from 'react';
import { OutsideAgentChanges } from '@/api/schema';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { useUpdateWorkspace, type Workspace } from '@/features/workspaces';
import { parseEnum } from '@/lib/enum';
import { OUTSIDE_AGENT_CHANGES_COPY as COPY } from '../agent-proposals.constants';
import { OutsideAgentChangesOption } from './OutsideAgentChangesOption';

const CHOICES = [OutsideAgentChanges.require_approval, OutsideAgentChanges.apply_directly];

/**
 * Whether changes by AI agents connected over MCP wait for approval (the default) or apply at
 * once. Owners and Admins see it; changing it is recorded in the activity log.
 */
export function OutsideAgentChangesCard({ workspace }: { workspace: Workspace }) {
  const [choice, setChoice] = useState(workspace.outsideAgentChanges);
  const update = useUpdateWorkspace(workspace.id, COPY.saved);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate({ outsideAgentChanges: choice });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{COPY.title}</CardTitle>
        <CardDescription>{COPY.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError error={update.error} />
          <RadioGroup
            value={choice}
            onValueChange={(value) => setChoice(parseEnum(OutsideAgentChanges, value) ?? choice)}
            aria-label={COPY.title}
          >
            {CHOICES.map((value) => (
              <OutsideAgentChangesOption key={value} value={value} />
            ))}
          </RadioGroup>
          <Button
            type="submit"
            className="self-start"
            disabled={choice === workspace.outsideAgentChanges || update.isPending}
          >
            {update.isPending && <Spinner data-icon="inline-start" />}
            {COPY.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
