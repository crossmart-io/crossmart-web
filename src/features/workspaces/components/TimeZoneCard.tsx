import { type FormEvent, useState } from 'react';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useUpdateWorkspace } from '../hooks/useWorkspaceMutations';
import { browserTimeZone, timeZoneChoices } from '../time-zones';
import { WORKSPACE_FEEDBACK } from '../workspaces.constants';

const FIELD_ID = 'workspace-time-zone';

/** Where the workspace's day starts: reports count days, weeks and months in this zone. */
export function TimeZoneCard({ workspace }: { workspace: Workspace }) {
  const [zone, setZone] = useState(workspace.timeZone ?? browserTimeZone());
  const update = useUpdateWorkspace(workspace.id, WORKSPACE_FEEDBACK.timeZoneSaved);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate({ timeZone: zone });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time zone</CardTitle>
        <CardDescription>
          Reports count days, weeks and months in this zone, so everyone here sees the same numbers
          wherever they are.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError error={update.error} />
          <Field>
            <FieldLabel htmlFor={FIELD_ID}>Time zone</FieldLabel>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger id={FIELD_ID} className="w-full sm:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {timeZoneChoices().map((choice) => (
                  <SelectItem key={choice} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button
            type="submit"
            className="self-start"
            disabled={zone === workspace.timeZone || update.isPending}
          >
            {update.isPending && <Spinner data-icon="inline-start" />}
            Save time zone
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
