import { Check } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { acceptedScope, asksToWrite, requestedAgentScopes } from '../agent-authorization';
import {
  ACCESS_LEVEL_INPUT_ID_PREFIX,
  AGENT_ACCESS_LEVEL_COPY,
  AGENT_ACCESS_LEVELS,
  AGENT_LIMITS,
  AGENT_SCOPE_DESCRIPTIONS,
  AgentAccessLevel,
} from '../agents.constants';
import { useAgentConsent } from '../hooks/useAgentAuthorization';

function toAccessLevel(value: string): AgentAccessLevel | undefined {
  return AGENT_ACCESS_LEVELS.find((level) => level === value);
}

/** What the agent asks to do, how much of it to allow, and the answer. */
export function AgentConsentForm() {
  const { search } = useLocation();
  const scopes = requestedAgentScopes(search);
  const [level, setLevel] = useState(AgentAccessLevel.Full);
  const consent = useAgentConsent();
  const answer = (accept: boolean) =>
    consent.mutate(accept ? { accept, scope: acceptedScope(search, level) } : { accept });

  return (
    <FieldGroup>
      <FormError error={consent.error} />
      <ul className="space-y-2 text-sm">
        {scopes.map((scope) => (
          <li key={scope} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {AGENT_SCOPE_DESCRIPTIONS[scope]}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">{AGENT_LIMITS}</p>
      {asksToWrite(scopes) && <AccessLevelChoice value={level} onChange={setLevel} />}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={consent.isPending}
          onClick={() => answer(false)}
        >
          Deny
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={consent.isPending}
          onClick={() => answer(true)}
        >
          {consent.isPending ? 'Connecting…' : 'Allow'}
        </Button>
      </div>
    </FieldGroup>
  );
}

interface AccessLevelChoiceProps {
  value: AgentAccessLevel;
  onChange: (level: AgentAccessLevel) => void;
}

function AccessLevelChoice({ value, onChange }: AccessLevelChoiceProps) {
  return (
    <FieldSet>
      <FieldLegend variant="label">Allow</FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={(next) => {
          const level = toAccessLevel(next);
          if (level) onChange(level);
        }}
      >
        {AGENT_ACCESS_LEVELS.map((level) => (
          <FieldLabel key={level} htmlFor={`${ACCESS_LEVEL_INPUT_ID_PREFIX}${level}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{AGENT_ACCESS_LEVEL_COPY[level].label}</FieldTitle>
                <FieldDescription>{AGENT_ACCESS_LEVEL_COPY[level].summary}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={level} id={`${ACCESS_LEVEL_INPUT_ID_PREFIX}${level}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
