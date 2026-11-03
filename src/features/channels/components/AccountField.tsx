import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import type { AccountPrompt } from '../channels.constants';

const ACCOUNT_FIELD_ID = 'connect-channel-account';

interface AccountFieldProps {
  prompt: AccountPrompt;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

/** The account to connect, such as a store's myshopify.com domain. */
export function AccountField({ prompt, value, onChange, disabled }: AccountFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={ACCOUNT_FIELD_ID}>{prompt.label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={ACCOUNT_FIELD_ID}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={prompt.placeholder}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          disabled={disabled}
        />
        {prompt.suffix && (
          <InputGroupAddon align="inline-end">
            <InputGroupText>{prompt.suffix}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldDescription>{prompt.description}</FieldDescription>
    </Field>
  );
}
