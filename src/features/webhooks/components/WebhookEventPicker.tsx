import type { WebhookEventType } from '@/api/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field';
import {
  WEBHOOK_EVENT_COPY,
  WEBHOOK_EVENT_GROUPS,
  type WebhookEventGroup,
} from '../webhooks.constants';

interface WebhookEventPickerProps {
  value: readonly WebhookEventType[];
  onChange: (eventTypes: WebhookEventType[]) => void;
  /** Ties the picker to the message under it, for assistive technology. */
  describedBy?: string;
}

const EVENT_INPUT_ID_PREFIX = 'webhook-event-';
const GROUP_INPUT_ID_PREFIX = 'webhook-event-group-';

/** The events an endpoint receives, by area, each with what triggers it. */
export function WebhookEventPicker({ value, onChange, describedBy }: WebhookEventPickerProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2" aria-describedby={describedBy}>
      {WEBHOOK_EVENT_GROUPS.map((group) => (
        <EventGroupFieldset key={group.label} group={group} value={value} onChange={onChange} />
      ))}
    </div>
  );
}

interface EventGroupFieldsetProps extends Omit<WebhookEventPickerProps, 'describedBy'> {
  group: WebhookEventGroup;
}

function groupCheckState(group: WebhookEventGroup, value: readonly WebhookEventType[]) {
  const picked = group.eventTypes.filter((eventType) => value.includes(eventType)).length;
  if (picked === 0) return false;
  return picked === group.eventTypes.length ? true : 'indeterminate';
}

/** One area's events, with a box that picks or clears all of them. */
function EventGroupFieldset({ group, value, onChange }: EventGroupFieldsetProps) {
  const groupId = `${GROUP_INPUT_ID_PREFIX}${group.label}`;
  const toggle = (eventTypes: readonly WebhookEventType[], checked: boolean) => {
    const others = value.filter((eventType) => !eventTypes.includes(eventType));
    onChange(checked ? [...others, ...eventTypes] : others);
  };
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 flex items-center gap-2">
        <Checkbox
          id={groupId}
          checked={groupCheckState(group, value)}
          onCheckedChange={(checked) => toggle(group.eventTypes, checked === true)}
        />
        <FieldLabel htmlFor={groupId} className="text-sm font-medium">
          {group.label}
        </FieldLabel>
      </legend>
      {group.eventTypes.map((eventType) => (
        <EventCheckbox
          key={eventType}
          eventType={eventType}
          checked={value.includes(eventType)}
          onCheckedChange={(checked) => toggle([eventType], checked)}
        />
      ))}
    </fieldset>
  );
}

interface EventCheckboxProps {
  eventType: WebhookEventType;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function EventCheckbox({ eventType, checked, onCheckedChange }: EventCheckboxProps) {
  const id = `${EVENT_INPUT_ID_PREFIX}${eventType}`;
  const { label, description } = WEBHOOK_EVENT_COPY[eventType];
  return (
    <div className="flex items-start gap-2 pl-6">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next === true)}
        aria-describedby={`${id}-description`}
      />
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor={id} className="leading-tight font-normal">
          {label}
        </FieldLabel>
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description} <code className="font-mono">{eventType}</code>
        </p>
      </div>
    </div>
  );
}
